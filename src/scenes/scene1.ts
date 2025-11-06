import {
  Scene,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  LoadAssetContainerAsync,
  ArcRotateCamera,
  Tools,
} from "@babylonjs/core";

/**
 * Scene 1: Default test scene with box, ground, and alien GLB model
 */
export async function createScene1(scene: Scene): Promise<void> {
  // Create camera for Scene 1
  const camera = new ArcRotateCamera("camera1", Tools.ToRadians(60), Tools.ToRadians(57.3), 10, Vector3.Zero(), scene);
  camera.setTarget(Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;

  // Add a hemispheric light
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Create a ground plane
  MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, scene);

  // Load alien GLB model
  const testAsset = "https://assets.babylonjs.com/meshes/alien.glb";
  const assetContainer = await LoadAssetContainerAsync(testAsset, scene);
  assetContainer.addAllToScene();
  assetContainer.meshes[0].position.y = 1;
}
