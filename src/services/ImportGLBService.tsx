import type { ServiceDefinition } from "@babylonjs/inspector";
import { ToolsServiceIdentity, SelectionServiceIdentity } from "@babylonjs/inspector";
import type { IToolsService, ISelectionService } from "@babylonjs/inspector";
import { ImportGLBTools } from "./ImportGLB.";

export const GLBImportServiceDefinition: ServiceDefinition<[], [IToolsService, ISelectionService]> = {
    friendlyName: "Import GLB Tool",
    consumes: [ToolsServiceIdentity, SelectionServiceIdentity],
    factory: (toolsService, selectionService) => {
        const contentRegistration = toolsService.addSectionContent({
            key: "GLB Import",
            section: "GLB Import",
            component: ({ context }) => <ImportGLBTools scene={context} selectionService={selectionService} />,
        });

        return {
            dispose: () => {
                contentRegistration.dispose();
            },
        };
    },
};

export default {
    serviceDefinitions: [GLBImportServiceDefinition],
} as const;