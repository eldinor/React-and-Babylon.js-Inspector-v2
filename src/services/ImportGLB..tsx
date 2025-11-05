import { useState } from "react";
import type { FunctionComponent } from "react";
import type { Scene } from "@babylonjs/core/scene";
import {  LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Logger } from "@babylonjs/core/Misc/logger";
import { FileUploadLine,  type ISelectionService,} from "@babylonjs/inspector";

interface LoadedFile {
  name: string;
  size: number;
}

export const ImportGLBTools: FunctionComponent<{ scene: Scene }> = ({ scene }) => {
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const loadGLB = async (files: FileList) => {
    if (!files || files.length === 0) {
      Logger.Warn("No file selected");
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".glb") && !file.name.toLowerCase().endsWith(".gltf")) {
      Logger.Error("Please select a valid GLB or GLTF file");
      return;
    }

    // Create a URL for the file
    const fileURL = URL.createObjectURL(file);

    try {
      // Load the GLB file
      Logger.Log(`Loading GLB file: ${file.name}`);

     const container = await LoadAssetContainerAsync(fileURL, scene, { pluginExtension: ".glb" });
     container.addAllToScene()
      
      Logger.Log(`Successfully loaded ${file.name}`);

      console.log(file)

      // Add to loaded files list
      setLoadedFiles((prev) => [...prev, { name: file.name, size: file.size }]);

      // Auto-play animations if any
      /*
            if (scene.animationGroups.length > 0) {
                Logger.Log(`Found ${scene.animationGroups.length} animation group(s)`);
                scene.animationGroups.forEach((animationGroup, index) => {
                    Logger.Log(`Playing animation: ${animationGroup.name || `Animation ${index}`}`);
                    animationGroup.play(true);
                });
            }
*/
    } catch (error) {
      Logger.Error(`Error loading GLB file: ${error}`);
    } finally {
      // Always clean up the object URL, even if there was an error
      URL.revokeObjectURL(fileURL);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <FileUploadLine label="Load GLB File" accept=".glb,.gltf" onClick={(files: FileList) => loadGLB(files)} />

      {loadedFiles.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <h4 style={{ margin: 0, marginBottom: "4px", fontSize: "14px", fontWeight: 600 }}>Loaded Files:</h4>
          <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0, marginTop: "4px" }}>
            {loadedFiles.map((file, index) => (
              <li key={index} style={{ padding: "4px 0", fontSize: "12px", display: "flex", flexDirection: "column" }}>
                <span>• {file.name}</span>
                <span style={{ fontSize: "11px", color: "#888", marginLeft: "12px" }}>
                  {((file.size/1024)/1024).toFixed(2)+"MB"} 
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
