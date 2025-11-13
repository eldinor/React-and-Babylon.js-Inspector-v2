import type { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";
import type { Material } from "@babylonjs/core/Materials/material";
import type { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {
  ServiceDefinition,
  ISceneExplorerService,
  SceneExplorerServiceIdentity,
  ISceneContext,
  SceneContextIdentity,
  IPropertiesService,
  PropertiesServiceIdentity,
  ISelectionService,
  SelectionServiceIdentity,
  LinkToEntityPropertyLine,
} from "@babylonjs/inspector";
import { CubeRegular, Delete16Regular, Add16Regular } from "@fluentui/react-icons";

// ServiceDefinition that retrieves Reflection Probes from the scene
export const ReflectionProbesServiceDefinition: ServiceDefinition<
  [],
  [ISceneExplorerService, ISceneContext, IPropertiesService, ISelectionService]
> = {
  friendlyName: "Reflection Probes",
  consumes: [
    SceneExplorerServiceIdentity,
    SceneContextIdentity,
    PropertiesServiceIdentity,
    SelectionServiceIdentity,
  ],
  // This factory function creates the instance of the service.
  // It is effectively called when ShowInspector is called.
  factory: (sceneExplorerService, sceneContext, propertiesService, selectionService) => {
    // Store wrapped probe entities to maintain reference equality
    const wrappedProbes: unknown[] = [];
    // Map to store the original probe for each wrapped entity
    const probeMap = new WeakMap<object, ReflectionProbe>();

    // This adds a new section to Scene Explorer.
    const sectionRegistration = sceneExplorerService.addSection({
      // This is the name of the top level tree view item that will be displayed in Scene Explorer.
      displayName: "Reflection Probes",
      // This gets the immediate children of the top level tree view item.
      // We retrieve reflection probes directly from the scene
      getRootEntities: () => {
        const scene = sceneContext.currentScene;
        if (!scene || !scene.reflectionProbes) {
          wrappedProbes.length = 0;
          return [];
        }
        // Map reflection probes to objects with uniqueId property
        // Clear and repopulate the array
        wrappedProbes.length = 0;
        const entities = scene.reflectionProbes.map((probe, index) => {
          const wrapped = {
            ...probe,
            uniqueId: index, // Use index as uniqueId since ReflectionProbe doesn't have one
          };
          // Store the original probe reference
          probeMap.set(wrapped, probe);
          return wrapped;
        });
        wrappedProbes.push(...entities);
        return entities as unknown as readonly Readonly<{ uniqueId: number }>[];
      },
      // This gets the display info for an entity, which is primarily the name, and optionally can include
      // an Observable that notifies the display info (e.g. name) has changed.
      getEntityDisplayInfo: (entity) => {
        const probe = entity as unknown as ReflectionProbe;
        return {
          name: probe.name,
        };
      },
      entityIcon: () => <CubeRegular />,
      // Reflection probes don't have built-in add/remove observables in the scene
      // Return empty arrays for now
      getEntityAddedObservables: () => [],
      getEntityRemovedObservables: () => [],
    });

    // This adds new sections to the Properties pane for Reflection Probes
    const probePropertiesRegistration = propertiesService.addSectionContent({
      key: "Reflection Probe Properties",
      predicate: (entity: unknown): entity is ReflectionProbe => {
        // Check if the entity is one of our wrapped probes
        return wrappedProbes.includes(entity);
      },
      content: [
        {
          section: "Meshes in Probe Renderlist",
          component: ({ context }) => {
            // Get the original probe from the map
            const probe = probeMap.get(context as object);
            if (!probe) {
              return <div style={{ padding: "4px 8px", opacity: 0.6 }}>Probe not found</div>;
            }

            const renderList = probe.renderList || [];

            const handleRemoveMesh = (meshToRemove: AbstractMesh) => {
              if (probe.renderList) {
                const index = probe.renderList.indexOf(meshToRemove);
                if (index > -1) {
                  probe.renderList.splice(index, 1);
                  // Force a re-render by re-selecting the current entity
                  const currentEntity = selectionService.selectedEntity;
                  selectionService.selectedEntity = null;
                  // Use setTimeout to ensure the deselection is processed first
                  setTimeout(() => {
                    selectionService.selectedEntity = currentEntity;
                  }, 0);
                }
              }
            };

            return (
              <>
                {renderList.length === 0 ? (
                  <div style={{ padding: "4px 8px", opacity: 0.6 }}>No meshes in render list</div>
                ) : (
                  renderList.map((mesh, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ flex: 1 }}>
                        <LinkToEntityPropertyLine
                          label={mesh.name || `Mesh ${index}`}
                          entity={mesh}
                          selectionService={selectionService}
                        />
                      </div>
                      <Delete16Regular
                        onClick={() => handleRemoveMesh(mesh)}
                        style={{ cursor: "pointer", color: "#d13438", flexShrink: 0 }}
                      />
                    </div>
                  ))
                )}
              </>
            );
          },
        },
        {
          section: "Add Mesh",
          component: ({ context }) => {
            // Get the original probe from the map
            const probe = probeMap.get(context as object);
            if (!probe) {
              return <div style={{ padding: "4px 8px", opacity: 0.6 }}>Probe not found</div>;
            }

            const scene = sceneContext.currentScene;
            const renderList = probe.renderList || [];

            // Get materials from the Materials section (those using this probe)
            const materialsUsingProbe = scene ? scene.materials.filter((material: Material) => {
              const mat = material as PBRMaterial | StandardMaterial;
              return mat.reflectionTexture === probe.cubeTexture;
            }) : [];

            // Collect all meshes bound to materials in the Materials section
            const meshesBoundToMaterials = new Set<AbstractMesh>();
            materialsUsingProbe.forEach((material) => {
              const mat = material as PBRMaterial | StandardMaterial;
              const boundMeshes = mat.getBindedMeshes ? mat.getBindedMeshes() : [];
              boundMeshes.forEach((mesh) => meshesBoundToMaterials.add(mesh));
            });

            // Find all meshes that are NOT in renderList and NOT bound to materials in Materials section
            const availableMeshes = scene ? scene.meshes.filter((mesh) => {
              // Skip if already in renderList
              if (renderList.includes(mesh)) {
                return false;
              }

              // Skip if bound to a material in the Materials section
              if (meshesBoundToMaterials.has(mesh)) {
                return false;
              }

              // Only include meshes that have geometry OR have a PBR material
              const hasGeometry = mesh.geometry !== null && mesh.geometry !== undefined;
              const hasPBRMaterial = mesh.material && mesh.material.getClassName() === "PBRMaterial";

              if (!hasGeometry && !hasPBRMaterial) {
                return false;
              }

              return true;
            }) : [];

            const handleAddMesh = (mesh: AbstractMesh) => {
              if (!probe.renderList) {
                probe.renderList = [];
              }
              probe.renderList.push(mesh);
              // Force a re-render by re-selecting the current entity
              const currentEntity = selectionService.selectedEntity;
              selectionService.selectedEntity = null;
              setTimeout(() => {
                selectionService.selectedEntity = currentEntity;
              }, 0);
            };

            return (
              <>
                {availableMeshes.length === 0 ? (
                  <div style={{ padding: "4px 8px", opacity: 0.6 }}>No available meshes to add</div>
                ) : (
                  availableMeshes.map((mesh, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ flex: 1 }}>
                        <LinkToEntityPropertyLine
                          label={mesh.name || `Mesh ${index}`}
                          entity={mesh}
                          selectionService={selectionService}
                        />
                      </div>
                      <Add16Regular
                        onClick={() => handleAddMesh(mesh)}
                        style={{ cursor: "pointer", color: "#13a10e", flexShrink: 0 }}
                      />
                    </div>
                  ))
                )}
              </>
            );
          },
        },
        {
          section: "Materials Reflected This Probe",
          component: ({ context }) => {
            // Get the original probe from the map
            const probe = probeMap.get(context as object);
            if (!probe) {
              return <div style={{ padding: "4px 8px", opacity: 0.6 }}>Probe not found</div>;
            }

            const scene = sceneContext.currentScene;

            // Find all materials that use this probe's cubeTexture as reflectionTexture
            const materialsUsingProbe = scene ? scene.materials.filter((material: Material) => {
              // Check if material has reflectionTexture property (PBRMaterial, StandardMaterial, etc.)
              const mat = material as PBRMaterial | StandardMaterial;
              return mat.reflectionTexture === probe.cubeTexture;
            }) : [];

            const handleRemoveMaterial = (material: Material) => {
              const mat = material as PBRMaterial | StandardMaterial;
              if (mat.reflectionTexture) {
                mat.reflectionTexture = null;
                // Force a re-render by re-selecting the current entity
                const currentEntity = selectionService.selectedEntity;
                selectionService.selectedEntity = null;
                setTimeout(() => {
                  selectionService.selectedEntity = currentEntity;
                }, 0);
              }
            };

            return (
              <>
                {materialsUsingProbe.length === 0 ? (
                  <div style={{ padding: "4px 8px", opacity: 0.6 }}>No materials using this probe</div>
                ) : (
                  materialsUsingProbe.map((material, index) => {
                    const mat = material as PBRMaterial | StandardMaterial;
                    const boundMeshes = mat.getBindedMeshes ? mat.getBindedMeshes() : [];

                    return (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ flex: 1 }}>
                            <LinkToEntityPropertyLine
                              label={material.name || `Material ${index}`}
                              entity={material}
                              selectionService={selectionService}
                            />
                          </div>
                          <Delete16Regular
                            onClick={() => handleRemoveMaterial(material)}
                            style={{ cursor: "pointer", color: "#d13438", flexShrink: 0 }}
                          />
                        </div>
                        {boundMeshes.length > 0 && (
                          <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                            {boundMeshes.map((mesh, meshIndex) => (
                              <div key={meshIndex} style={{ fontSize: "11px", opacity: 0.8 }}>
                                <LinkToEntityPropertyLine
                                  label={mesh.name || `Mesh ${meshIndex}`}
                                  entity={mesh}
                                  selectionService={selectionService}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            );
          },
        },
        {
          section: "Add Material",
          component: ({ context }) => {
            // Get the original probe from the map
            const probe = probeMap.get(context as object);
            if (!probe) {
              return <div style={{ padding: "4px 8px", opacity: 0.6 }}>Probe not found</div>;
            }

            const scene = sceneContext.currentScene;

            // Get the renderList to check which materials are bound to meshes in it
            const renderList = probe.renderList || [];
            const renderListMaterials = new Set<Material>();
            renderList.forEach((mesh) => {
              if (mesh.material) {
                renderListMaterials.add(mesh.material);
              }
            });

            // Find all PBR materials that are NOT using this probe and are NOT "default material"
            const availableMaterials = scene ? scene.materials.filter((material: Material) => {
              // Skip non-PBR materials
              if (material.getClassName() !== "PBRMaterial") {
                return false;
              }

              // Skip default material
              if (material.name === "default material") {
                return false;
              }

              // Skip materials that are bound to meshes in the renderList
              if (renderListMaterials.has(material)) {
                return false;
              }

              const mat = material as PBRMaterial;
              // Only show materials that don't already have this probe's cubeTexture
              return mat.reflectionTexture !== probe.cubeTexture;
            }) : [];

            const handleAddMaterial = (material: Material) => {
              const mat = material as PBRMaterial;
              mat.reflectionTexture = probe.cubeTexture;
              // Force a re-render by re-selecting the current entity
              const currentEntity = selectionService.selectedEntity;
              selectionService.selectedEntity = null;
              setTimeout(() => {
                selectionService.selectedEntity = currentEntity;
              }, 0);
            };

            return (
              <>
                {availableMaterials.length === 0 ? (
                  <div style={{ padding: "4px 8px", opacity: 0.6 }}>No available materials to add</div>
                ) : (
                  availableMaterials.map((material, index) => {
                    const mat = material as PBRMaterial;
                    const boundMeshes = mat.getBindedMeshes ? mat.getBindedMeshes() : [];

                    return (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ flex: 1 }}>
                            <LinkToEntityPropertyLine
                              label={material.name || `Material ${index}`}
                              entity={material}
                              selectionService={selectionService}
                            />
                          </div>
                          <Add16Regular
                            onClick={() => handleAddMaterial(material)}
                            style={{ cursor: "pointer", color: "#13a10e", flexShrink: 0 }}
                          />
                        </div>
                        {boundMeshes.length > 0 && (
                          <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                            {boundMeshes.map((mesh, meshIndex) => (
                              <div key={meshIndex} style={{ fontSize: "11px", opacity: 0.8 }}>
                                <LinkToEntityPropertyLine
                                  label={mesh.name || `Mesh ${meshIndex}`}
                                  entity={mesh}
                                  selectionService={selectionService}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            );
          },
        },
      ],
    });

    return {
      dispose: () => {
        sectionRegistration.dispose();
        probePropertiesRegistration.dispose();
      },
    };
  },
};

