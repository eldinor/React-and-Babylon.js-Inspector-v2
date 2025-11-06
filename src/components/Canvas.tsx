import { useEffect, useRef, useState } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders";
import { ShowInspector } from "@babylonjs/inspector";
import { serviceList } from "../services/ServiceList";
import { extensionList } from "../services/ExtensionList";
import { createScene1 } from "../scenes/scene1";
import { createScene2 } from "../scenes/scene2";
import { createScene3 } from "../scenes/scene3";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const [currentScene, setCurrentScene] = useState<number>(2);
  const enabledServices = serviceList;

  // Load scene content based on scene number
  const loadSceneContent = async (sceneNumber: number, scene: Scene) => {
    // Dispose all meshes, lights, and cameras from the previous scene
    scene.meshes.slice().forEach((mesh) => mesh.dispose());
    scene.lights.slice().forEach((light) => light.dispose());
    scene.cameras.slice().forEach((camera) => camera.dispose());

    // Load the selected scene
    switch (sceneNumber) {
      case 1:
        await createScene1(scene);
        break;
      case 2:
        await createScene2(scene);
        break;
      case 3:
        await createScene3(scene);
        break;
    }

    // Attach the active camera to the canvas
    if (scene.activeCamera && canvasRef.current) {
      scene.activeCamera.attachControl(canvasRef.current, true);
    }
  };

  // Handle loading empty scene
  const loadEmptyScene = () => {
    if (sceneRef.current && currentScene !== 3) {
      setCurrentScene(3);
      loadSceneContent(3, sceneRef.current);
    }
  };

  // Initialize engine and scene only once
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Babylon.js engine
    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    // Create scene
    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Expose loadEmptyScene to window for the toolbar button
    (window as any).__loadEmptyScene = loadEmptyScene;

    // Load initial scene (camera will be created by the scene)
    loadSceneContent(currentScene, scene);

    // Defer Inspector update to avoid race condition during render
    setTimeout(() => {
      ShowInspector(sceneRef.current!, {
        embedMode: false,
        enableClose: true,
        overlay: true,
        serviceDefinitions: enabledServices,
        extensionFeeds: extensionList,
      });
    }, 100);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        outline: "none",
      }}
    />
  );
}
