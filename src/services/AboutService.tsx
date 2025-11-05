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
import { InfoRegular } from "@fluentui/react-icons";

export const AboutServiceDefinition: ServiceDefinition<[], [IShellService, ISceneContext, ISelectionService]> = {
  friendlyName: "About",
  consumes: [ShellServiceIdentity, SceneContextIdentity, SelectionServiceIdentity],
  factory: (shellService, sceneContext) => {
    // Define the React component for the mesh vertices treemap
    const About: FunctionComponent<{ scene: Scene }> = ({ scene }) => {
      return <div style={{ display: "flex", flex: 1, padding: "12px" }}>Inspector v2 Extensions</div>;
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
