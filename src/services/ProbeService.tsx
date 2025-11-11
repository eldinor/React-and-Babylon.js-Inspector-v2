import type { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";
import {
  ServiceDefinition,
  ISceneExplorerService,
  SceneExplorerServiceIdentity,
  ISceneContext,
  SceneContextIdentity,
} from "@babylonjs/inspector";
import { CubeRegular } from "@fluentui/react-icons";

// ServiceDefinition that retrieves Reflection Probes from the scene
export const ReflectionProbesServiceDefinition: ServiceDefinition<
  [],
  [ISceneExplorerService, ISceneContext]
> = {
  friendlyName: "Reflection Probes",
  consumes: [SceneExplorerServiceIdentity, SceneContextIdentity],
  // This factory function creates the instance of the service.
  // It is effectively called when ShowInspector is called.
  factory: (sceneExplorerService, sceneContext) => {
    // This adds a new section to Scene Explorer.
    const sectionRegistration = sceneExplorerService.addSection({
      // This is the name of the top level tree view item that will be displayed in Scene Explorer.
      displayName: "Reflection Probes",
      // This gets the immediate children of the top level tree view item.
      // We retrieve reflection probes directly from the scene
      getRootEntities: () => {
        const scene = sceneContext.currentScene;
        if (!scene || !scene.reflectionProbes) {
          return [];
        }
        // Map reflection probes to objects with uniqueId property
        return scene.reflectionProbes.map((probe, index) => ({
          ...probe,
          uniqueId: index, // Use index as uniqueId since ReflectionProbe doesn't have one
        })) as unknown as readonly Readonly<{ uniqueId: number }>[];
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

    return sectionRegistration;
  },
};

