import { useState } from "react";
import type { FunctionComponent } from "react";
import type { Scene } from "@babylonjs/core/scene";
import type { AssetContainer } from "@babylonjs/core/assetContainer";
import {  LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Logger } from "@babylonjs/core/Misc/logger";
import { FileUploadLine,  type ISelectionService,} from "@babylonjs/inspector";
import { Delete16Regular, Delete24Regular } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";

interface LoadedFile {
  name: string;
  size: number;
  meshName: string;
  container: AssetContainer;
}

export const ImportGLBTools: FunctionComponent<{ scene: Scene; selectionService: ISelectionService }> = ({ scene, selectionService }) => {
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const loadGLB = async (files: FileList) => {
    if (!files || files.length === 0) {
      Logger.Warn("No file selected");
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".glb")) {
      Logger.Error("Please select a valid GLB file");
      return;
    }

    // Create a URL for the file
    const fileURL = URL.createObjectURL(file);

    try {
      // Load the GLB file
      Logger.Log(`Loading GLB file: ${file.name}`);

     const container = await LoadAssetContainerAsync(fileURL, scene, { pluginExtension: ".glb" });
     const meshName = file.name.substring(0, file.name.lastIndexOf("."));
     container.meshes[0].name = meshName;
     container.addAllToScene()

      Logger.Log(`Successfully loaded ${file.name}`);

      // Select the first mesh from the loaded container
      if (container.meshes.length > 0) {
        selectionService.selectedEntity = container.meshes[0];
        Logger.Log(`Selected mesh: ${container.meshes[0].name}`);
      }

      // Add to loaded files list
      setLoadedFiles((prev) => [...prev, { name: file.name, size: file.size, meshName, container }]);

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

  const handleDelete = (index: number) => {
    const fileToDelete = loadedFiles[index];

    // Dispose the container
    fileToDelete.container.dispose();
    Logger.Log(`Disposed container: ${fileToDelete.name}`);

    // Remove from the list
    setLoadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDisposeAll = () => {
    // Dispose all containers
    loadedFiles.forEach((file) => {
      file.container.dispose();
      Logger.Log(`Disposed container: ${file.name}`);
    });

    // Clear the list
    setLoadedFiles([]);
    Logger.Log("All containers disposed");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <FileUploadLine label="Load GLB File" accept=".glb" onClick={(files: FileList) => loadGLB(files)} />

      {loadedFiles.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <h4 style={{ margin: 0, marginBottom: "4px", fontSize: "14px", fontWeight: 600 }}>Loaded Files:</h4>
          <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0, marginTop: "4px" }}>
            {loadedFiles.map((file, index) => {
              const handleClick = () => {
                const mesh = scene.getMeshByName(file.meshName);
                if (mesh) {
                  selectionService.selectedEntity = mesh;
                  Logger.Log(`Selected mesh: ${mesh.name}`);
                }
              };

              return (
                <li key={index} style={{ padding: "4px 0", fontSize: "12px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span
                      onClick={handleClick}
                      style={{
                        cursor: "pointer",
                        color: "#0078d4",
                        textDecoration: "underline"
                      }}
                    >
                      • {file.name}
                    </span>
                    <span style={{ fontSize: "11px", color: "#888", marginLeft: "12px" }}>
                      {((file.size/1024)/1024).toFixed(2)+"MB"}
                    </span>
                  </div>
                  <Delete16Regular
                    onClick={() => handleDelete(index)}
                    style={{
                      cursor: "pointer",
                      color: "#d13438",
                      flexShrink: 0
                    }}
                  />
                </li>
              );
            })}
          </ul>
          <Button
            appearance="secondary"
            onClick={handleDisposeAll}
            style={{ marginTop: "8px", width: "100%" }}
          >
            Dispose All
          </Button>
        </div>
      )}
    </div>
  );
};
