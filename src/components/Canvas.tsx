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
import { ShowInspector } from "@babylonjs/inspector";
import { VertexTreeMapServiceDefinition } from "../services/VertexTreeMapService";
import { MemoryCounterServiceDefinition } from "../services/MemoryCounterToolbarService";
import { COLORS } from "../constants/layout";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Babylon.js engine
    const engine = new Engine(canvasRef.current, true);

    // Create scene
    const scene = new Scene(engine);
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

      setTimeout(
        () =>
         
         ShowInspector(scene, {embedMode:false, enableClose:true, overlay:true,
            serviceDefinitions: [VertexTreeMapServiceDefinition, MemoryCounterServiceDefinition],
         }),
        1000
      );
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

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      style={{
        display: "block",
        width: "100%",
        height: "calc(100vh - 150px)",
        backgroundColor: COLORS.canvas,
        margin: 0,
        padding: 0,
        outline:"none"
      }}
    />
  );
}

