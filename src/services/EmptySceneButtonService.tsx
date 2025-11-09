import { ShellServiceIdentity, IShellService, ServiceDefinition } from "@babylonjs/inspector";
import { type FunctionComponent } from "react";
import { Button } from "@fluentui/react-components";

interface EmptySceneButtonProps {
  onLoadEmptyScene: () => void;
}

export const EmptySceneButtonServiceDefinition: ServiceDefinition<[], [IShellService]> = {
  friendlyName: "Empty Scene Button",
  consumes: [ShellServiceIdentity],
  factory: (shellService: IShellService) => {
    const EmptySceneButton: FunctionComponent<EmptySceneButtonProps> = ({ onLoadEmptyScene }) => {
      return (
        <Button appearance="secondary" onClick={onLoadEmptyScene}>
          Empty Scene
        </Button>
      );
    };

    const toolbarItemRegistration = shellService.addToolbarItem({
      key: "Empty Scene Button",
      horizontalLocation: "left",
      verticalLocation: "bottom",
      component: () => <EmptySceneButton onLoadEmptyScene={() => {
        // This will be set from Canvas component
        if ((window as any).__loadEmptyScene) {
          (window as any).__loadEmptyScene();
        }
      }} />,
    });

    return toolbarItemRegistration;
  },
};

