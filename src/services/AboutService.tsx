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
import { type FunctionComponent} from "react";
import { Info16Regular, InfoRegular } from "@fluentui/react-icons";
import { serviceList } from "../services/ServiceList"
import { Tooltip } from "@fluentui/react-components";import { extensionList } from "./ExtensionList";
;

export const AboutServiceDefinition: ServiceDefinition<[], [IShellService, ISceneContext, ISelectionService]> = {
  friendlyName: "About",
  consumes: [ShellServiceIdentity, SceneContextIdentity, SelectionServiceIdentity],
  factory: (shellService, sceneContext) => {
    // Define the React component for the mesh vertices treemap
    const About: FunctionComponent<{ scene: Scene }> = ({ scene }) => {

      return         <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "12px" }}>
          <h3 style={{ marginTop: 0 }}>Inspector v2 ServiceDefinitions</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {serviceList.map((service, index) => (
              <li key={index} style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>• {service.friendlyName}</span>
                <Tooltip content={`Service definition for ${service.friendlyName}`} relationship="description">
                  <Info16Regular style={{ cursor: "help"}} />
                </Tooltip>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 0 }}>Inspector v2 ExtensionFeeds</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {extensionList.map((feed, index) => (
              <li key={index} style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>• {feed.name}</span>
                <Tooltip content={feed._extensions[0].description} relationship="description">
                  <Info16Regular style={{ cursor: "help" }} />
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
    };

    const sidePaneRegistration = shellService.addSidePane({
      key: "About",
      title: "About",
      order: 400,
      icon: InfoRegular,
      horizontalLocation: "right",
      verticalLocation: "top",
      content: () => {
        const scene = useObservableState(() => sceneContext.currentScene, sceneContext.currentSceneObservable);

        return scene ? <About scene={scene} /> : null;
      },
    });

    return {
      dispose: () => {
        sidePaneRegistration.dispose();
      },
    };
  },
};
