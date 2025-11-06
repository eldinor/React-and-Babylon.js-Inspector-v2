import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import type { Scene } from "@babylonjs/core/scene";
import type { AssetContainer } from "@babylonjs/core/assetContainer";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {  LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { Logger } from "@babylonjs/core/Misc/logger";
import { FileUploadLine,  type ISelectionService,} from "@babylonjs/inspector";
import { Delete16Regular, Copy16Regular, DocumentCopy16Regular } from "@fluentui/react-icons";
import { Button, Tooltip, Switch } from "@fluentui/react-components";

interface CloneInstance {
  name: string;
  rootNode: TransformNode;
  type: "clone" | "instance";
}

interface LoadedFile {
  name: string;
  size: number;
  meshName: string;
  container: AssetContainer;
  clones: CloneInstance[];
}

export const ImportGLBTools: FunctionComponent<{ scene: Scene; selectionService: ISelectionService }> = ({ scene, selectionService }) => {
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const [autoSelectModel, setAutoSelectModel] = useState<boolean>(true);

  // Watch for disposal of loaded containers and clones/instances
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const observers: Array<{ node: AbstractMesh | TransformNode; observer: any }> = [];

    loadedFiles.forEach((file, fileIndex) => {
      // Watch the main container's first mesh for disposal
      if (file.container.meshes.length > 0) {
        const mainMesh = file.container.meshes[0];
        const observer = mainMesh.onDisposeObservable.add(() => {
          Logger.Log(`Container mesh disposed externally: ${file.name}`);
          setLoadedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        });
        observers.push({ node: mainMesh, observer });
      }

      // Watch each clone/instance for disposal
      file.clones.forEach((clone) => {
        const cloneRootNode = clone.rootNode;
        const observer = cloneRootNode.onDisposeObservable.add(() => {
          Logger.Log(`${clone.type} disposed: ${clone.name}`);
          setLoadedFiles((prev) => {
            return prev.map((f) => ({
              ...f,
              clones: f.clones.filter((c) => c.rootNode !== cloneRootNode),
            }));
          });
        });
        observers.push({ node: cloneRootNode, observer });
      });
    });

    // Cleanup observers when component unmounts or loadedFiles changes
    return () => {
      observers.forEach(({ node, observer }) => {
        if (node.onDisposeObservable && observer) {
          node.onDisposeObservable.remove(observer);
        }
      });
    };
  }, [loadedFiles]);

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

      // Select the first mesh from the loaded container (if auto-select is enabled)
      if (autoSelectModel && container.meshes.length > 0) {
        selectionService.selectedEntity = container.meshes[0];
        Logger.Log(`Selected mesh: ${container.meshes[0].name}`);
      }

      // Add to loaded files list
      setLoadedFiles((prev) => [...prev, { name: file.name, size: file.size, meshName, container, clones: [] }]);

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
    // Dispose all containers and their clones/instances
    loadedFiles.forEach((file) => {
      // Dispose all clones and instances first (preserve materials)
      file.clones.forEach((clone) => {
        // Dispose the root node and all its children recursively
        clone.rootNode.dispose(false, false);
        Logger.Log(`Disposed ${clone.type}: ${clone.name}`);
      });

      // Dispose the container
      file.container.dispose();
      Logger.Log(`Disposed container: ${file.name}`);
    });

    // Clear the list
    setLoadedFiles([]);
    Logger.Log("All containers disposed");
  };

  const handleClone = (index: number) => {
    const file = loadedFiles[index];

    // Clone using instantiateModelsToScene with doNotInstantiate: true
    const result = file.container.instantiateModelsToScene(undefined, false, { doNotInstantiate: true });

    if (result.rootNodes.length > 0) {
      const rootNode = result.rootNodes[0] as TransformNode;
      const cloneName = `${file.meshName}_clone_${file.clones.filter(c => c.type === "clone").length + 1}`;
      rootNode.name = cloneName;

      // Add to clones list
      setLoadedFiles((prev) => {
        const updated = [...prev];
        updated[index].clones.push({ name: cloneName, rootNode, type: "clone" });
        return updated;
      });

      // Select the first root node (if auto-select is enabled)
      if (autoSelectModel) {
        selectionService.selectedEntity = rootNode;
      }
      Logger.Log(`Cloned container: ${file.name} as ${cloneName}`);
    }
  };

  const handleInstance = (index: number) => {
    const file = loadedFiles[index];

    // Instance using instantiateModelsToScene with doNotInstantiate: false
    const result = file.container.instantiateModelsToScene(undefined, false, { doNotInstantiate: false });

    if (result.rootNodes.length > 0) {
      const rootNode = result.rootNodes[0] as TransformNode;
      const instanceName = `${file.meshName}_instance_${file.clones.filter(c => c.type === "instance").length + 1}`;
      rootNode.name = instanceName;

      // Add to clones list
      setLoadedFiles((prev) => {
        const updated = [...prev];
        updated[index].clones.push({ name: instanceName, rootNode, type: "instance" });
        return updated;
      });

      // Select the first root node (if auto-select is enabled)
      if (autoSelectModel) {
        selectionService.selectedEntity = rootNode;
      }
      Logger.Log(`Instanced container: ${file.name} as ${instanceName}`);
    }
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
                        textDecoration: "underline"
                      }}
                    >
                      • {file.name}
                    </span>
                    <span style={{ fontSize: "11px", color: "#888", marginLeft: "12px" }}>
                      {((file.size/1024)/1024).toFixed(2)+"MB"}
                    </span>
                    {file.clones.length > 0 && (
                      <div style={{ marginLeft: "12px", marginTop: "4px" }}>
                        {file.clones.map((clone, cloneIndex) => {
                          const handleCloneClick = () => {
                            selectionService.selectedEntity = clone.rootNode;
                            Logger.Log(`Selected ${clone.type}: ${clone.name}`);
                          };

                          const handleCloneDispose = () => {
                            // Dispose the clone/instance (preserve materials)
                            // The onDisposeObservable will automatically remove it from the list
                            clone.rootNode.dispose(false, false);
                            Logger.Log(`Disposed ${clone.type}: ${clone.name}`);
                          };

                          return (
                            <div key={cloneIndex} style={{ fontSize: "11px", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span
                                onClick={handleCloneClick}
                                style={{
                                  cursor: "pointer",
                                  color: clone.type === "clone" ? "#8B7355" : "#13a10e",
                                  textDecoration: "underline"
                                }}
                              >
                                ↳ {clone.name}
                              </span>
                              <Tooltip content="Delete" relationship="label">
                                <Delete16Regular
                                  onClick={handleCloneDispose}
                                  style={{ cursor: "pointer", color: "#d13438" }}
                                />
                              </Tooltip>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <Tooltip content="Clone" relationship="label">
                      <Copy16Regular
                        onClick={() => handleClone(index)}
                        style={{
                          cursor: "pointer",
                          color: "#8B7355",
                          flexShrink: 0
                        }}
                      />
                    </Tooltip>
                    <Tooltip content="Instance" relationship="label">
                      <DocumentCopy16Regular
                        onClick={() => handleInstance(index)}
                        style={{
                          cursor: "pointer",
                          color: "#13a10e",
                          flexShrink: 0
                        }}
                      />
                    </Tooltip>
                    <Tooltip content="Delete" relationship="label">
                      <Delete16Regular
                        onClick={() => handleDelete(index)}
                        style={{
                          cursor: "pointer",
                          color: "#d13438",
                          flexShrink: 0
                        }}
                      />
                    </Tooltip>
                  </div>
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
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch
              checked={autoSelectModel}
              onChange={(e) => setAutoSelectModel(e.currentTarget.checked)}
              label="Auto-select loaded model"
            />
          </div>
        </div>
      )}
    </div>
  );
};
