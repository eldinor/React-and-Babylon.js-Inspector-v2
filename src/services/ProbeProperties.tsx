import {
  Engine,
  Scene,
  LoadAssetContainerAsync,
  Observable,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import {
  ShowInspector,
  ServiceDefinition,
  ISceneExplorerService,
  SceneExplorerServiceIdentity,
  IPropertiesService,
  PropertiesServiceIdentity,
  ISelectionService,
  SelectionServiceIdentity,
  LinkToEntityPropertyLine,
} from "@babylonjs/inspector";
import { WebAssetRegular } from "@fluentui/react-icons";
import { useMemo } from "react";



(async () => {


  // These are used to indicate when a model is added or removed, though this is
  // not demonstrated in this example for simplicity.
  const modelAddedObservable = new Observable<(typeof models)[number]>();
  const modelRemovedObservable = new Observable<(typeof models)[number]>();

  // Now we create a ServiceDefinition that just captures the models array for simplicity.
  // We just need some way for the service to get access to the model array.
  const AssetContainersServiceDefinition: ServiceDefinition<
    [],
    [ISceneExplorerService, IPropertiesService, ISelectionService]
  > = {
    friendlyName: "Asset Containers",
    consumes: [
      SceneExplorerServiceIdentity,
      PropertiesServiceIdentity,
      SelectionServiceIdentity,
    ],
    // This factory function creates the instance of the service.
    // It is effectively called when ShowInspector is called.
    factory: (sceneExplorerService, propertiesService, selectionService) => {
      // This adds a new section to Scene Explorer.
      const sectionRegistration = sceneExplorerService.addSection({
        // This is the name of the top level tree view item that will be displayed in Scene Explorer.
        displayName: "Asset Containers",
        // This gets the immediate children of the top level tree view item.
        getRootEntities: () => models,
        // This gets the display info for an entity, which is primarily the name, and optionally can include
        // an Observable that notifies the display info (e.g. name) has changed.
        getEntityDisplayInfo: (model) => {
          return {
            name: model.name,
          };
        },
        entityIcon: () => <WebAssetRegular />,
        getEntityAddedObservables: () => [modelAddedObservable],
        getEntityRemovedObservables: () => [modelRemovedObservable],
      });

      // This adds new sections to the Properties pane, specifically for our "models."
      const modelPropertiesRegistration = propertiesService.addSectionContent({
        key: "Model Properties",
        predicate: (entity: unknown) => models.includes(entity),
        content: [
          {
            section: "Meshes",
            component: ({ context }) => (
              <>
                {context.assetContainer.meshes.map((mesh, index) => (
                  <LinkToEntityPropertyLine
                    label={index}
                    entity={mesh}
                    selectionService={selectionService}
                  />
                ))}
              </>
            ),
          },
          {
            section: "Skeletons",
            component: ({ context }) => (
              <>
                {context.assetContainer.skeletons.map((skeleton, index) => (
                  <LinkToEntityPropertyLine
                    label={index}
                    entity={skeleton}
                    selectionService={selectionService}
                  />
                ))}
              </>
            ),
          },
        ],
      });

      // This adds new properties to the existing General section of meshes (the same could be done for skeletons, textures, etc.).
      // The new property is a link back to the model that this mesh was loaded from.
      const owningModelPropertiesRegistration =
        propertiesService.addSectionContent({
          key: "Model Properties",
          // If the entity that we are showing properties for is a mesh that is in one of the model's AssetContainers,
          // then we want to add new properties.
          predicate: (entity: unknown) =>
            models.some((model) =>
              model.assetContainer.meshes.includes(entity)
            ),
          content: [
            {
              section: "General",
              component: ({ context }) => {
                // Find the model associated with this mesh.
                const model = useMemo(
                  () =>
                    models.filter((model) =>
                      model.assetContainer.meshes.includes(context)
                    )[0],
                  [context]
                );

                // Display a link back to the model.
                return (
                  <>
                    <LinkToEntityPropertyLine
                      label="Asset Container"
                      entity={model}
                      selectionService={selectionService}
                    />
                  </>
                );
              },
            },
          ],
        });

      return {
        dispose: () => {
          sectionRegistration.dispose();
          modelPropertiesRegistration.dispose();
          owningModelPropertiesRegistration.dispose();
        },
      };
    },
  };


})();
