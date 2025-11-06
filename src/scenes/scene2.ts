import {
  Scene,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  PBRMaterial,
  Color3,
  CubeTexture,
  ArcRotateCamera,
  GreasedLineRibbonAutoDirectionMode,
} from "@babylonjs/core";

/**
 * Scene 2: PBR test scene with multiple primitives and materials
 * Based on public/Qwen_html_20251106_hgikt5xyu.html
 */
export async function createScene2(scene: Scene): Promise<void> {
  // --- Camera ---
  const camera = new ArcRotateCamera("camera2", -Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
  camera.setTarget(Vector3.Zero());

  // --- Lighting ---
  const dirLight = new DirectionalLight("dirLight", new Vector3(2, -3, -1), scene);
  dirLight.intensity = 0.8;
  dirLight.position = new Vector3(10, 15, 10);

  const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.3;

  // --- Ground Plane ---
  const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
  const groundMaterial = new PBRMaterial("groundMat", scene);
  groundMaterial.albedoColor = new Color3(0.2, 0.2, 0.2);
  groundMaterial.roughness = 0.9;
  ground.material = groundMaterial;
  ground.position.y = -1;

  // --- Mesh Primitives with PBR Materials ---
  const positions = [
    new Vector3(-3, 0, 0), // Cube
    new Vector3(-1.5, 0, 0), // Sphere
    new Vector3(0, 0, 0), // Cylinder
    new Vector3(1.5, 0, 0), // Cone
    new Vector3(3, 0, 0), // Torus
  ];

  const names = ["cube", "sphere", "cylinder", "cone", "torus"];
  const colors = [
    new Color3(0.8, 0.2, 0.2), // Red
    new Color3(0.9, 0.9, 0.9), // White
    new Color3(0.4, 0.4, 0.4), // Gray
    new Color3(0.2, 0.6, 0.2), // Green
    new Color3(0.2, 0.4, 0.8), // Blue
  ];

  const materials: PBRMaterial[] = [];

  for (let i = 0; i < names.length; i++) {
    let mesh;
    switch (i) {
      case 0: // Cube
        mesh = MeshBuilder.CreateBox("cube", { size: 1 }, scene);
        break;
      case 1: // Sphere
        mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1.5, segments: 32 }, scene);
        break;
      case 2: // Cylinder
        mesh = MeshBuilder.CreateCylinder("cylinder", { height: 1.5, diameter: 1 }, scene);
        break;
      case 3: // Cone
        mesh = MeshBuilder.CreateCylinder("cone", { height: 1.2, diameterTop: 0, diameterBottom: 1.2 }, scene);
        break;
      case 4: // Torus
        mesh = MeshBuilder.CreateTorus("torus", { thickness: 0.4, diameter: 1.2 }, scene);
        break;
      default:
        mesh = MeshBuilder.CreateBox("default", { size: 1 }, scene);
    }

    mesh.position = positions[i];

    // Create PBR Material
    const pbrMat = new PBRMaterial(names[i] + "Mat", scene);
    pbrMat.albedoColor = colors[i];

    // Vary metallic/roughness for visual interest
    if (i === 1) {
      // Sphere - glossy
      pbrMat.metallic = 0.1;
      pbrMat.roughness = 0.1;
    } else if (i === 2) {
      // Cylinder - metallic
      pbrMat.metallic = 0.9;
      pbrMat.roughness = 0.2;
    } else {
      pbrMat.metallic = 0.0;
      pbrMat.roughness = 0.7;
    }

    mesh.material = pbrMat;
    materials.push(pbrMat);
  }

  // --- Environment Reflection ---
  const hdrTexture = CubeTexture.CreateFromPrefilteredData(
    "https://playground.babylonjs.com/textures/environment.dds",
    scene
  );
  scene.environmentTexture = hdrTexture;

  // Apply environment to all PBR materials
  materials.forEach((mat) => (mat.reflectionTexture = hdrTexture));
}
