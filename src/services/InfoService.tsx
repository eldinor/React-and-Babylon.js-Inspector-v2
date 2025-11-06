import { Scene } from "@babylonjs/core";
import {
  ShellServiceIdentity,
  type IShellService,
  SceneContextIdentity,
  type ISceneContext,
  type ISelectionService,
  SelectionServiceIdentity,
  useObservableState,
  type ServiceDefinition,
} from "@babylonjs/inspector";
import { type FunctionComponent } from "react";
import { Info16Regular, InfoRegular } from "@fluentui/react-icons";
import { serviceList } from "./ServiceList";
import { Tooltip } from "@fluentui/react-components";
import { extensionMetadata } from "./ExtensionList";


export const InfoServiceDefinition: ServiceDefinition<[], [IShellService, ISceneContext, ISelectionService]> = {
  friendlyName: "Info",
  consumes: [ShellServiceIdentity, SceneContextIdentity, SelectionServiceIdentity],
  factory: (shellService, sceneContext) => {
    // Define the React component for the mesh vertices treemap
    const Info: FunctionComponent<{ scene: Scene }> = ({ scene }) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "12px" }}>
          <h3 style={{ margin: 0 }}>Custom ServiceDefinitions</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop:"4px"}}>
            {serviceList.map((service, index) => (
              <li key={index} style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>• {service.friendlyName}</span>
                <Tooltip content={`Service definition for ${service.friendlyName}`} relationship="description">
                  <Info16Regular style={{ cursor: "help" }} />
                </Tooltip>
              </li>
            ))}
          </ul>
          <h3 style={{ margin: 0 }}>Custom ExtensionFeeds</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0 ,marginTop:"4px"}}>
            {extensionMetadata.map((extension, index) => (
              <li key={index} style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>• {extension.name}</span>
                <Tooltip content={extension.description} relationship="description">
                  <Info16Regular style={{ cursor: "help" }} />
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    const sidePaneRegistration = shellService.addSidePane({
      key: "Info",
      title: "Inspector v2 Custom Extensions Info",
      order: 400,
      icon: InfoRegular,
      horizontalLocation: "right",
      verticalLocation: "top",
      content: () => {
        const scene = useObservableState(() => sceneContext.currentScene, sceneContext.currentSceneObservable);

        return scene ? <Info scene={scene} /> : null;
      },
    });

    return {
      dispose: () => {
        sidePaneRegistration.dispose();
      },
    };
  },
};
