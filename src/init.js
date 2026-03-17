// ======================================================
// INITIALIZATION MODULE
// Handles file input, graph setup, and data preparation
// ======================================================

// ======================================================
// FILE INPUT (NETLIST IMPORT)
// ======================================================

// Listen for netlist file upload
document.getElementById("netlistFile").addEventListener(
    "change",
    function (e) {
        e = e || window.event;
        readGraphFile(e);
    },
    false,
);

// Read and parse uploaded netlist file
function readGraphFile(e) {
    if (e.target.files.length === 1) {
        var file = e.target.files[0];
        Graph.appData.netlistFile = file.name;

        var reader = new FileReader();

        reader.onload = (function () {
            return function (e) {
                netlist = JSON.parse(e.target.result);

                Graph.appData.netlistJSON = _.cloneDeep(netlist);

                // Initialize graph rendering pipeline
                forceGraphSettings(netlist);

                Graph.appData.dataSet = false;
            };
        })(file);

        reader.readAsText(file);
    }
}

// ======================================================
// GRAPH INITIALIZATION (FORCE GRAPH CONFIGURATION)
// ======================================================

function forceGraphSettings(graphJSON) {
    setTimeout(buildGraph, 1000);

    console.time("Rendering");

    Graph.graphData(graphJSON)

        // ---------------- Rendering ----------------
        .warmupTicks(50)
        .cooldownTime(15000)
        .d3AlphaDecay(0.01)
        .d3VelocityDecay(0.01)
        .numDimensions(Graph.appData.dimensions)

        // ---------------- Visuals ----------------
        .nodeThreeObject((node) => nodeTHREESettings(node))

        .linkDirectionalArrowLength(3.5)
        .linkDirectionalArrowRelPos(1)

        .linkColor((link) => linkColorSettings(link))
        .linkWidth((link) => linkWidthSettings(link))
        .linkOpacity(0.6)
        .linkCurvature((link) => linkCurvatureSettings(link))

        // ---------------- Node Interaction ----------------
        .nodeLabel((node) => `${node.id}`)
        .onNodeClick((node, evt) => focusOnNode(node))
        .onNodeRightClick((node, evt) => removeNodes([node.id]))

        // ---------------- Background Interaction ----------------
        .onBackgroundRightClick((evt) => resetCamera());

    console.timeEnd("Rendering");
}

// ======================================================
// GRAPH BUILD PIPELINE
// ======================================================

// Main initialization pipeline after graph data is loaded
function buildGraph() {
    closeAllModals();
    clearAllSelectFields();

    setInitialCameraPosition();

    addSelectOptions("viewSelect", Object.keys(Graph.appData.cameraViews));

    showFileInfo();

    // Reset runtime state
    Graph.appData.removedNodes = [];
    Graph.appData.isCooled = false;
    Graph.appData.isAnimationActive = true;
    Graph.appData.cameraPoints = [];

    if (!Graph.appData.dataSet) {
        // ---------------- Node / Link Initialization ----------------
        initNodeProperties();
        initLinkProperties();

        // ---------------- Library Integration ----------------
        if (Graph.appData.libraryJSON !== null) {
            readLibraryFunctions();
            readLibraryTypes();

            assignNodeFunctions();
            assignNodeTypes();
        }

        // ---------------- Structure Analysis ----------------
        assignNodePred();
        assignNodeSucc();
        setStructureCounts();

        // ---------------- Clustering Data ----------------
        getMCLIterations();
        getPartitionData();

        getRegularClusterData("louvain");
        getRegularClusterData("nsbm");
        getRegularClusterData("leiden_mod");

        addSelectOptions("clusteringSelect", getClusteringOptions());
        addSelectOptions(
            "mclIterationSelect",
            Graph.appData.clusterIterations.mcl,
        );
        addSelectOptions("suspiciousnessSelect", getSuspiciousnessOptions());
        addSelectOptions("partitionSelect", Graph.appData.partitions);

        setClusterRunOptions();
        setClusterEntryOptions("louvain");
        setClusterEntryOptions("nsbm");
        setClusterEntryOptions("leiden_mod");

        // ---------------- Final Graph Refresh ----------------
        refreshGraph();

        Graph.appData.dataSet = true;
    }
}

// ======================================================
// UI HELPERS
// ======================================================

// Display loaded file names in sidebar
function showFileInfo() {
    var netlistInfo = document.getElementById("netlistInfo");
    var libraryInfo = document.getElementById("libraryInfo");

    netlistInfo.innerHTML = Graph.appData.netlistFile;
    libraryInfo.innerHTML = Graph.appData.libraryFile;
}

// ======================================================
// NODE / LINK INITIALIZATION
// ======================================================

// Initialize node properties (internal state)
function initNodeProperties() {
    var { nodes, links } = Graph.graphData();

    nodes.forEach((n) => {
        n.colorMode = "none";
        n.prevColorMode = "none";

        if (typeof n.function === "undefined") n.function = "unknown";

        n.type = "unknown";
        n.group = -1;

        n.structureFound = false;
        n.structureID = -1;

        n.pred = [];
        n.succ = [];

        n.realPred = [];
        n.realSucc = [];

        n.clusterData = {};
        n.clusterData.louvain = {};
        n.clusterData.mcl = {};
        n.clusterData.partition = {};
        n.clusterData.nsbm = {};
        n.clusterData.leiden_mod = {};
    });
}

// Initialize link properties
function initLinkProperties() {
    var { nodes, links } = Graph.graphData();

    links.forEach((l) => {
        l.group = -1;
    });
}

// ======================================================
// CLUSTER UI SETUP
// ======================================================

// Populate run dropdowns for clustering methods
function setClusterRunOptions() {
    const methods = ["louvain", "nsbm", "leiden_mod"];

    for (method of methods) {
        var runs = Graph.appData.clusterRuns[method];
        addSelectOptions(method + "RunSelect", runs);
    }
}

// Populate entry dropdown based on selected run
function setClusterEntryOptions(method) {
    var runSelect = document.getElementById(method + "RunSelect");
    var entrySelect = document.getElementById(method + "EntrySelect");

    var entryCounts = Graph.appData.clusterEntryCounts[method];
    var entryCount = entryCounts[runSelect.value];

    for (let i = 1; i <= entryCount; i++) {
        var op = new Option(i);
        op.classList.add("addedOption");

        entrySelect.options.add(op);
    }
}

// ======================================================
// GRAPH STRUCTURE (PREDECESSORS / SUCCESSORS)
// ======================================================

// Assign incoming edges
function assignNodePred() {
    var { nodes, links } = Graph.graphData();

    links.forEach((l) => {
        l.target.pred.push(l.source.id);
    });
}

// Assign outgoing edges
function assignNodeSucc() {
    var { nodes, links } = Graph.graphData();

    links.forEach((l) => {
        l.source.succ.push(l.target.id);
    });
}

// ======================================================
// CLUSTER DISTANCE UI
// ======================================================

// Populate cluster distance selection UI
function setClusterDistanceOptions() {
    var clusterSelect = document.getElementById("clusterDistanceSelect");
    var groups = Graph.appData.groups;

    clusterSelect.innerHTML = "";

    let counter = 1;

    for (group of groups) {
        var color = groupColors[group];

        var option = document.createElement("option");

        option.innerHTML = `Cluster ${counter}`;
        option.value = group;

        option.classList.add("addedOption");
        option.classList.add("clusterDistanceOption");

        option.style.backgroundColor = color;

        clusterSelect.options.add(option);

        counter++;
    }
}

// ======================================================
// CLUSTER OPTION DETECTION
// ======================================================

// Detect available clustering methods from node attributes
function getClusteringOptions() {
    const { nodes, links } = Graph.graphData();

    var options = [];

    var louvainFound = false;
    var mclFound = false;
    var partitionsFound = false;
    var nsbmFound = false;
    var leidenFound = false;
    var suspFound = false;

    nodes.forEach((n) => {
        if (typeof n.louvain !== "undefined" && !louvainFound)
            louvainFound = true;
        if (typeof n.mcl !== "undefined" && !mclFound) mclFound = true;
        if (typeof n.partition !== "undefined" && !partitionsFound)
            partitionsFound = true;
        if (typeof n.nsbm !== "undefined" && !nsbmFound) nsbmFound = true;
        if (typeof n.leiden_mod !== "undefined" && !leidenFound)
            leidenFound = true;

        if (
            (typeof n.susp_mean !== "undefined" ||
                typeof n.susp_min !== "undefined" ||
                typeof n.susp_max !== "undefined") &&
            !suspFound
        ) {
            suspFound = true;
        }
    });

    if (louvainFound) options.push("Louvain");
    if (mclFound) options.push("MCL");
    if (partitionsFound) options.push("Partition");
    if (nsbmFound) options.push("NSBM");
    if (leidenFound) options.push("Leiden");
    if (suspFound) options.push("Suspiciousness");

    return options;
}

// ======================================================
// STRUCTURE ANALYSIS
// ======================================================

// Compute structural relationships (same-function neighbors)
function setStructureCounts() {
    var { nodes, links } = Graph.graphData();

    for (node of nodes) {
        if (node.function !== "unknown") {
            var pred = nodes.filter((n) => node.pred.indexOf(n.id) !== -1);
            var succ = nodes.filter((n) => node.succ.indexOf(n.id) !== -1);

            for (let i = 0; i < pred.length; i++) {
                if (node.function === pred[i].function) {
                    node.realPred.push(pred[i].id);
                }
            }

            for (let i = 0; i < succ.length; i++) {
                if (node.function === succ[i].function) {
                    node.realSucc.push(succ[i].id);
                }
            }
        }
    }
}

// ======================================================
// LIBRARY PROCESSING
// ======================================================

// Extract available gate types from library
function readLibraryTypes() {
    var cells = Graph.appData.libraryJSON.cells;
    var types = [];

    for (let i = 0; i < cells.length; i++) {
        var cell = cells[i];

        if (types.indexOf(cell.type) === -1) {
            types.push(cell.type);
        }
    }

    Graph.appData.libraryTypes = types;
}

// Extract available gate functions
function readLibraryFunctions() {
    Graph.appData.libraryFunctions = Graph.appData.libraryJSON.functions;
}

// Assign functions to nodes based on library mapping
function assignNodeFunctions() {
    var { nodes, links } = Graph.graphData();
    var cells = Array.from(Graph.appData.libraryJSON.cells);

    nodes.forEach((node) => {
        if (
            typeof node.function === "undefined" ||
            node.function === "unknown"
        ) {
            var functionFound = false;

            for (cell of cells) {
                if (node.id.split("_")[0] === cell.name) {
                    node.function = cell.function;
                    functionFound = true;
                }
            }

            if (!functionFound) node.function = "unknown";
        }
    });
}

// Assign gate types to nodes
function assignNodeTypes() {
    var { nodes, links } = Graph.graphData();
    var cells = Array.from(Graph.appData.libraryJSON.cells);

    nodes.forEach((node) => {
        var typeFound = false;

        for (let i = 0; i < cells.length; i++) {
            var cell = cells[i];

            if (node.id.split("_")[0] === cell.name) {
                node.type = cell.type;
                typeFound = true;
                break;
            }
        }

        if (!typeFound) node.type = "undefined";
    });
}
