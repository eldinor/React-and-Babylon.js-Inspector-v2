import { BuiltInsExtensionFeed } from "@babylonjs/inspector";

const graphicsBudgetExtension = {
  name: "Graphics Budget",
  description: "Provides graphics budget settings and UI to surface warnings when the thresholds are exceeded.",
  keywords: ["graphics", "budget"],
  getExtensionModuleAsync: async () => import("../services/graphicsBudgetService"),
};

export const extensionList = [new BuiltInsExtensionFeed("Graphics Budget", [graphicsBudgetExtension])];
