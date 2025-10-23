import {
  Engine,
  Scene,
  LoadAssetContainerAsync,
  Observable,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  ArcRotateCamera,
  Tools,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import {
  ShowInspector,
  ShellServiceIdentity,
  type IShellService,
  SceneContextIdentity,
  type ISceneContext,
  type ServiceDefinition,
  type ISelectionService,
  SelectionServiceIdentity,
  useObservableState,
} from "@babylonjs/inspector";
import { type FunctionComponent, useCallback, useEffect,  useMemo, useRef } from "react";
import { DataTreemapRegular } from "@fluentui/react-icons";
import ReactECharts from "echarts-for-react";

// Define the service definition outside the App component
export const VertexTreeMapServiceDefinition: ServiceDefinition<[], [IShellService, ISceneContext, ISelectionService]> =
  {
    friendlyName: "Vertex Tree Map",
    consumes: [ShellServiceIdentity, SceneContextIdentity, SelectionServiceIdentity],
    factory: (shellService, sceneContext, selectionService) => {
      // Define the React component for the mesh vertices treemap
      const MeshVerticesTreeMap: FunctionComponent<{ scene: Scene }> = ({ scene }) => {
        const meshes = useObservableState(
          useCallback(() => [...scene.meshes], [scene]),
          scene.onNewMeshAddedObservable,
          scene.onMeshRemovedObservable
        );

        const data = useMemo(() => {
          return meshes
            .filter((mesh) => mesh.getTotalVertices() > 0)
            .map((mesh) => {
              return {
                name: mesh.name,
                value: mesh.getTotalVertices(),
                mesh: mesh.uniqueId,
              };
            });
        }, [meshes]);

        const option = {
          tooltip: {
            formatter: (info: any) => {
              const value = info.value;
              return `${info.name}: ${value} Vertices`;
            },
          },
          series: [
            {
              type: "treemap",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              roam: false,
              nodeClick: false,
              breadcrumb: { show: false },
              itemStyle: {
                borderColor: "#00000000",
                borderWidth: 2,
              },
              data,
            },
          ],
        };

        return (
          <div style={{ display: "flex", flex: 1, padding: "8px" }}>
            <ReactECharts
              option={option}
              style={{ height: "100%", width: "100%" }}
              onEvents={{
                click: (params: any) => (selectionService.selectedEntity = scene.getMeshByUniqueId(params.data.mesh)),
              }}
            />
          </div>
        );
      };

      const sidePaneRegistration = shellService.addSidePane({
        key: "Vertex Tree Map",
        title: "Vertex Tree Map",
        order: 450,
        icon: DataTreemapRegular,
        horizontalLocation: "right",
        verticalLocation: "top",
        content: () => {
          const scene = useObservableState(() => sceneContext.currentScene, sceneContext.currentSceneObservable);

          return scene ? <MeshVerticesTreeMap scene={scene} /> : null;
        },
      });

      return {
        dispose: () => {
          sidePaneRegistration.dispose();
        },
      };
    },
  };

// Main App component
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Babylon.js engine
    const engine = new Engine(canvasRef.current, true);

    // Create scene
    const scene = new Scene(engine);
    scene.clearColor.set(0.1, 0.1, 0.1, 1);

    // Create default camera and light
    const camera = new ArcRotateCamera("camera", Tools.ToRadians(60), Tools.ToRadians(57.3), 10, Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    camera.setTarget(Vector3.Zero());
    camera.wheelDeltaPercentage = 0.01

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


      engine.runRenderLoop(() => {
        scene.render();
      });

      setTimeout(
        () =>
          ShowInspector(scene, {
            // Here we provide an array of ServiceDefinitions, and for this demo just the one we defined above.
            serviceDefinitions: [VertexTreeMapServiceDefinition],
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
    <div className="App" style={{ width: "100%", height: "100vh" }}>
      <canvas ref={canvasRef} id="renderCanvas" style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default App;