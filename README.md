# Babylon.js Inspector v2 - Custom Extensions Collection

A project showcasing custom **ServiceDefinitions** and **ExtensionFeeds** for the Babylon.js Inspector v2, built with React 19, TypeScript, and Vite.

## 🌐 Live Demo

**[https://inspector.babylonpress.org/](https://inspector.babylonpress.org/)**

## 📋 Overview

This project demonstrates how to extend the Babylon.js Inspector v2 with custom tools, visualizations, and utilities. It includes several custom services and extensions that enhance the Inspector's functionality for 3D scene development and debugging.

## ✨ Features

### Custom ServiceDefinitions

1. **Vertex Tree Map** - Interactive treemap visualization of mesh vertex counts

   - Side pane visualization using ECharts
   - Click to select meshes in the Inspector
   - Real-time updates when meshes are added/removed

2. **Memory Counter** - Real-time JavaScript heap memory usage monitor

   - Bottom toolbar badge display
   - Updates every 500ms
   - Shows memory in MB

3. **BabylonPress Logo** - Clickable branding link

   - Bottom toolbar logo display
   - Links to [BabylonPress.org](https://babylonpress.org/)
   - Opens in new tab

4. **Info Service** - Documentation panel

   - Lists all custom ServiceDefinitions
   - Lists all custom ExtensionFeeds
   - Tooltips with descriptions

5. **Reflection Probes** - Scene Explorer integration for Reflection Probes

   - Adds "Reflection Probes" section to Scene Explorer
   - Properties pane with four sections:
     - **Meshes in Probe Renderlist** - View and manage meshes in the probe's renderList
     - **Add Mesh** - Add available meshes to the renderList (with geometry/PBR material filtering)
     - **Materials Reflected This Probe** - View materials using the probe's cubeTexture
     - **Add Material** - Assign probe's cubeTexture to available PBR materials
   - Add/Remove icons for easy management
   - Auto-refresh on changes
   - Smart filtering to prevent conflicts

6. **Capture Toolbar** - Screenshot capture tool

   - Bottom toolbar capture button
   - Take screenshots of the current scene
   - Save screenshots to disk
   - Delete captured screenshots
   - Preview captured images

### Custom ExtensionFeeds

1. **Graphics Budget** - Performance monitoring and threshold warnings

   - Configurable draw call thresholds (warning/danger)
   - Settings panel integration
   - Toolbar indicator with color-coded badges
   - Real-time draw call counter

2. **Import GLB** - Advanced GLB model management

   - Load GLB files into AssetContainers
   - Create clones (independent geometry) and instances (shared geometry)
   - Individual disposal with material preservation
   - Auto-sync with Scene Explorer
   - Quick selection of models and derivatives
   - Auto-select toggle
   - Batch disposal with "Dispose All"

3. **Dispose By Type [Experimental]** - Batch disposal tool

   - Dispose scene objects by type (lights, meshes, materials, textures, etc.)
   - Batch selection with checkboxes
   - Preview before disposal
   - Organized by object type
   - Quick cleanup for large scenes

4. **Capture Toolbar** - Screenshot capture extension
   - Integrated with Capture Toolbar service
   - Provides screenshot functionality
   - Save and delete options

## 🛠️ Tech Stack

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.1.7
- **Babylon.js** 8.35.0
- **Babylon.js Inspector** 8.35.0-preview
- **Fluent UI** (React Icons & Components)
- **ECharts** (for React) 3.0.2

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/eldinor/Babylon.js-Inspector-v2-Custom-Extensions.git

# Navigate to project directory
cd Babylon.js-Inspector-v2-Custom-Extensions

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   └── Canvas.tsx                      # Main Babylon.js canvas component
├── services/
│   ├── ServiceList.tsx                 # Registry of custom ServiceDefinitions
│   ├── ExtensionList.tsx               # Registry of custom ExtensionFeeds
│   ├── VertexTreeMapService.tsx        # Vertex treemap visualization
│   ├── MemoryCounterToolbarService.tsx # Memory usage monitor
│   ├── LogoService.tsx                 # BabylonPress logo
│   ├── InfoService.tsx                 # Documentation panel
│   ├── ProbeService.tsx                # Reflection Probes integration
│   ├── CaptureToolbarService.tsx       # Screenshot capture service
│   ├── graphicsBudgetService.tsx       # Graphics budget extension
│   ├── ImportGLB.tsx                   # GLB import tool component
│   ├── ImportGLBService.tsx            # GLB import extension
│   ├── DisposeByType.tsx               # Dispose by type tool component
│   └── DisposeByTypeService.tsx        # Dispose by type extension
├── App.tsx
└── main.tsx
public/
└── bplogo.svg                          # BabylonPress logo
```

## 🎯 Usage Examples

### Import GLB Tool

1. Click "Load GLB File" to import a model
2. Click the model name to select it in the Inspector
3. Use the **Clone** icon (brown) to create independent copies
4. Use the **Instance** icon (green) to create lightweight instances
5. Click **Delete** icons to remove individual items
6. Toggle "Auto-select loaded model" to control selection behavior
7. Use "Dispose All" to clean up all loaded models

### Graphics Budget

1. Open Settings panel in the Inspector
2. Configure draw call warning/danger thresholds
3. Monitor the toolbar badge for real-time draw call counts
4. Badge color changes based on thresholds (success/warning/danger)

### Vertex Tree Map

1. Open the "Vertex Tree Map" side pane
2. View interactive treemap of mesh vertex counts
3. Click on any mesh block to select it in the Inspector
4. Visualization updates automatically when meshes change

### Reflection Probes

1. Expand "Reflection Probes" section in Scene Explorer
2. Click on a probe to view its properties
3. **Meshes in Probe Renderlist** - View meshes currently rendered by the probe
   - Click the red delete icon to remove a mesh from the renderList
4. **Add Mesh** - Add meshes to the probe's renderList
   - Only shows meshes with geometry or PBR materials
   - Click the add icon to add a mesh
5. **Materials Reflected This Probe** - View materials using this probe
   - Shows bound meshes under each material
   - Click the red delete icon to remove the probe from a material
6. **Add Material** - Assign the probe to available materials
   - Only shows PBR materials not already using this probe
   - Click the add icon to assign the probe

### Dispose By Type

1. Open the "Dispose By Type [Experimental]" tool
2. Select object type (Lights, Meshes, Materials, Textures, etc.)
3. Check items you want to dispose
4. Click "Dispose Selected" to remove them from the scene
5. Use for quick cleanup of large scenes

### Capture Toolbar

1. Click the "Capture" button in the bottom toolbar
2. Screenshot is captured and displayed
3. Click "Save" to download the screenshot
4. Click "Delete" to discard the screenshot

## 🔧 Customization

### Adding New Services

1. Create a new service file in `src/services/`
2. Define a `ServiceDefinition` with:
   - `friendlyName`: Display name
   - `consumes`: Array of service identities to consume
   - `produces`: (Optional) Array of service identities to produce
   - `factory`: Function that creates the service instance
3. Add to `ServiceList.tsx`

### Adding New Extensions

1. Create extension module in `src/services/`
2. Define extension metadata in `ExtensionList.tsx`
3. Add to `extensionList` array

## 📚 Documentation

- [Babylon.js Inspector v2 Documentation](https://doc.babylonjs.com/toolsAndResources/inspectorv2)
- [Babylon.js Documentation](https://doc.babylonjs.com/)

## 👤 Author

**Andrei Stepanov** (labris)

- Website: [BabylonPress.org](https://babylonpress.org/)
- GitHub: [@eldinor](https://github.com/eldinor)

## 🙏 Acknowledgments

- Graphics Budget extension originally by **Ryan Tremblay** (ryantrem)
- Built with [Babylon.js](https://www.babylonjs.com/)
- UI components from [Fluent UI](https://react.fluentui.dev/)

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. Feel free to use.

Copyright 2025 Andrei Stepanov

## 🐛 Issues

Report Custom Extensions issues at: [GitHub Custom Extensions Issues](https://github.com/eldinor/Babylon.js-Inspector-v2-Custom-Extensions/issues)

Report Inspector v2 issues at: [Babylon.js GitHub Inspector v2](https://github.com/BabylonJS/Babylon.js/issues/17293)
