import type { ServiceDefinition } from "@babylonjs/inspector";
import { ToolsServiceIdentity } from "@babylonjs/inspector";
import type { IToolsService } from "@babylonjs/inspector";
import { ImportGLBTools } from "./ImportGLB."; 

export const GLBImportServiceDefinition: ServiceDefinition<[], [IToolsService]> = {
    friendlyName: "Import GLB Tool",
    consumes: [ToolsServiceIdentity],
    factory: (toolsService) => {
        const contentRegistration = toolsService.addSectionContent({
            key: "GLB Import",
            section: "GLB Import",
            component: ({ context }) => <ImportGLBTools scene={context} />,
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