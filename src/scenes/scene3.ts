import { Scene, HemisphericLight, Vector3, ArcRotateCamera, Tools, CubeTexture } from "@babylonjs/core";

/**
 * Scene 3: Empty scene with camera, light, and HDR environment (no meshes)
 */
export async function createScene3(scene: Scene): Promise<void> {
  // Create camera for Scene 3
  const camera = new ArcRotateCamera("camera3", Tools.ToRadians(60), Tools.ToRadians(57.3), 10, Vector3.Zero(), scene);
  camera.setTarget(Vector3.Zero());
  camera.wheelDeltaPercentage = 0.01;

  // Add a hemispheric light (same as Scene 1)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Add HDR environment texture
  const hdrTexture = CubeTexture.CreateFromPrefilteredData("/environmentSpecular.env", scene);
  scene.environmentTexture = hdrTexture;

  // No meshes - empty scene
}
