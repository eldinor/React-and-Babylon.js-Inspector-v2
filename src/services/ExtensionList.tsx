import { BuiltInsExtensionFeed, ExtensionMetadata } from "@babylonjs/inspector";

const BabylonPressResources = {
    homepage: "https://inspector.babylonpress.org/",
    repository: "https://github.com/eldinor/Babylon.js-Inspector-v2-Custom-Extensions",
    bugs: "https://github.com/eldinor/Babylon.js-Inspector-v2-Custom-Extensions/issues",
      author: { name: "Andrei Stepanov", forumUserName: "labris", url: "https://babylonpress.org"},
} as const satisfies Partial<ExtensionMetadata>;

const graphicsBudgetExtension = {
  name: "Graphics Budget",
  description: "Provides graphics budget settings and UI to surface warnings when the thresholds are exceeded.",
  keywords: ["graphics", "budget", "indicator", "toolbar"],
  homepage: "https://doc.babylonjs.com/toolsAndResources/inspectorv2/examples/#dynamic-extensions",
  author: {name:"Ryan Tremblay",forumUserName: "ryantrem" },
  getExtensionModuleAsync: async () => import("../services/graphicsBudgetService"),
};

const importGLBExtension = {
  name: "Import GLB",
  description: "Provides a tool to import GLB files into the scene and then clone, instance and manipulate them.",
  keywords: ["import", "glb", "tools"],
  ...BabylonPressResources,
  getExtensionModuleAsync: async () => import("../services/ImportGLBService"),
};

export const extensionList = [new BuiltInsExtensionFeed(graphicsBudgetExtension.name, [graphicsBudgetExtension]),
new BuiltInsExtensionFeed(importGLBExtension.name, [importGLBExtension])];

// Export extension metadata for display purposes
// TODO: Convert to function
export const extensionMetadata = [
  { name: graphicsBudgetExtension.name, description: graphicsBudgetExtension.description },
  { name: importGLBExtension.name, description: importGLBExtension.description },
];
