import { BuiltInsExtensionFeed } from "@babylonjs/inspector";

const graphicsBudgetExtension = {
  name: "Graphics Budget",
  description: "Provides graphics budget settings and UI to surface warnings when the thresholds are exceeded.",
  keywords: ["graphics", "budget"],
  getExtensionModuleAsync: async () => import("../services/graphicsBudgetService"),
};

const importGLBExtension = {
  name: "Import GLB",
  description: "Provides a tool to import GLB files into the scene.",
  keywords: ["import", "glb"],
  getExtensionModuleAsync: async () => import("../services/ImportGLBService"),
};

export const extensionList = [new BuiltInsExtensionFeed("Graphics Budget", [graphicsBudgetExtension]),
new BuiltInsExtensionFeed("Import GLB", [importGLBExtension])];
