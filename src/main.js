// ======================================================
// MAIN MODULE
// Creates the global 3D force graph instance and stores
// shared application state in Graph.appData
// ======================================================

// Graph container element
let graphContainer = document.getElementById("3d-graph");

// Initialize 3D force graph
let Graph = ForceGraph3D({
    controlType: "trackball",
    rendererConfig: {
        antialias: true,
        alpha: true,
        precision: "lowp",
    },
})(graphContainer);

// Shared application state
Graph.appData = {
    // --------------------------------------------------
    // Project metadata
    // --------------------------------------------------
    projectName: "RE_3D_Project",

    // --------------------------------------------------
    // Netlist data
    // --------------------------------------------------
    netlistJSON: null,
    netlistFile: "",

    // --------------------------------------------------
    // Library data
    // --------------------------------------------------
    libraryJSON: null,
    libraryTypes: [],
    libraryFunctions: [],
    libraryFile: "",
    libraryCellCounter: 1,

    // --------------------------------------------------
    // Graph runtime state
    // --------------------------------------------------
    removedNodes: [],
    isCooled: false,
    isAnimationActive: true,
    dimensions: 3,
    dataSet: false,

    // --------------------------------------------------
    // Camera presets
    // --------------------------------------------------
    cameraViews: {
        Initial: {
            lookAt: { x: 0, y: 0, z: 0 },
            x: 0,
            y: 0,
            z: 1000,
        },
    },

    // --------------------------------------------------
    // Clustering metadata
    // --------------------------------------------------
    clusterRuns: {
        louvain: [],
        nsbm: [],
        leiden_mod: [],
    },

    clusterIterations: {
        mcl: [],
    },

    clusterEntryCounts: {
        louvain: {},
        nsbm: {},
        leiden_mod: {},
    },

    partitions: [],

    // --------------------------------------------------
    // Structure detection results
    // --------------------------------------------------
    chains: [],
    loops: [],
    trees: [],

    // --------------------------------------------------
    // Layout / grouping
    // --------------------------------------------------
    groupDistances: { default: 40 },
    groups: [],
    selectedGroup: -1,
    centerCoreNodes: [],
    dffCoreNodes: [],

    // --------------------------------------------------
    // Active tool / mode state
    // --------------------------------------------------
    toolMode: "none",
    layoutMode: "weight",

    // --------------------------------------------------
    // Analysis settings / backups
    // --------------------------------------------------
    dffInputThreshold: 10,
    lastBackup: null,
    weightBackup: null,
    lookAtNodes: [],
};

// Expose graph globally
window.Graph = Graph;
