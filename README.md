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
│   └── Canvas.tsx          # Main Babylon.js canvas component
├── services/
│   ├── ServiceList.tsx     # Registry of custom ServiceDefinitions
│   ├── ExtensionList.tsx   # Registry of custom ExtensionFeeds
│   ├── VertexTreeMapService.tsx
│   ├── MemoryCounterToolbarService.tsx
│   ├── LogoService.tsx
│   ├── InfoService.tsx
│   ├── graphicsBudgetService.tsx
│   ├── ImportGLB.tsx       # GLB import tool component
│   └── ImportGLBService.tsx
├── App.tsx
└── main.tsx
public/
└── bplogo.svg              # BabylonPress logo
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
