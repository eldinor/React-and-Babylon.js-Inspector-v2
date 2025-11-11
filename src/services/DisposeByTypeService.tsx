import { IToolsService, ToolsServiceIdentity, ISelectionService, SelectionServiceIdentity, ServiceDefinition } from "@babylonjs/inspector";
import { DisposeByTypeTools } from "./DisposeByType";

export const DisposeByTypeServiceDefinition: ServiceDefinition<[], [IToolsService, ISelectionService]> = {
    friendlyName: "Dispose By Type Tool",
    consumes: [ToolsServiceIdentity, SelectionServiceIdentity],
    factory: (toolsService, selectionService) => {
        const contentRegistration = toolsService.addSectionContent({
            key: "Dispose By Type [Experimental]",
            section: "Dispose By Type [Experimental]",
            component: ({ context }) => <DisposeByTypeTools scene={context} selectionService={selectionService} />,
        });

        return {
            dispose: () => {
                contentRegistration.dispose();
            },
        };
    },
};

export default {
    serviceDefinitions: [DisposeByTypeServiceDefinition],
} as const;

