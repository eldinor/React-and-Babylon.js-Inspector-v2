import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  LoadAssetContainerAsync,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  ArcRotateCamera,
  Tools,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { ShowInspector, HideInspector, BuiltInsExtensionFeed } from "@babylonjs/inspector";
import { VertexTreeMapServiceDefinition } from "../services/VertexTreeMapService";
import { MemoryCounterServiceDefinition } from "../services/MemoryCounterToolbarService";
import { COLORS } from "../constants/layout";
import { useServiceDefinitions } from "../context/ServiceDefinitionsContext";
import { GraphicsBudgetServiceDefinition } from "../services/graphicsBudgetService";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const { services } = useServiceDefinitions();

  // Initialize scene only once
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Babylon.js engine
    const engine = new Engine(canvasRef.current, true);

    // Create scene
    const scene = new Scene(engine);
    sceneRef.current = scene;
   // scene.clearColor.set(0.1, 0.1, 0.1, 1);

    // Create default camera and light
    const camera = new ArcRotateCamera(
      "camera",
      Tools.ToRadians(60),
      Tools.ToRadians(57.3),
      10,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.setTarget(Vector3.Zero());
    camera.wheelDeltaPercentage = 0.01;

    // Add a hemispheric light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a simple box mesh
    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.x = -2;
    box.position.y = 1;

    // Create a ground plane
    MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, scene);

    const testAsset = "https://assets.babylonjs.com/meshes/alien.glb";

    (async () => {
      const assetContainer = await LoadAssetContainerAsync(testAsset, scene);
      assetContainer.addAllToScene();
      assetContainer.meshes[0].position.y = 1;
    })();

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle window resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  // Update Inspector when services change
  useEffect(() => {
    if (!sceneRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enabledServices: any[] = [];
    if (services.find((s) => s.name === "VertexTreeMap")?.enabled) {
      enabledServices.push(VertexTreeMapServiceDefinition);
    }
    if (services.find((s) => s.name === "MemoryCounter")?.enabled) {
      enabledServices.push(MemoryCounterServiceDefinition);
    }

// enabledServices.push(GraphicsBudgetServiceDefinition);

    // Defer Inspector update to avoid race condition during render
    setTimeout(() => {
      HideInspector();
      ShowInspector(sceneRef.current!, {
        embedMode: false,
        enableClose: true,
        overlay: true,
        serviceDefinitions: enabledServices,
              extensionFeeds: [
        new BuiltInsExtensionFeed("Test Feed", [
          {
            name: "Graphics Budget",
            description:
              "Provides graphics budget settings and UI to surface warnings when the thresholds are exceeded.",
            keywords: ["graphics", "budget"],
            getExtensionModuleAsync: async () =>
              import("../services/graphicsBudgetService"),
          },
        ]),
      ],
      });
    }, 100);
  }, [services]);

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      style={{
        display: "block",
        width: "100%",
        height: "calc(100vh - 130px)",
        backgroundColor: COLORS.canvas,
        margin: 0,
        padding: 0,
        outline:"none"
      }}
    />
  );
}

