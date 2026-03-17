# Repository Context Part 4/5

Generated for LLM prompt context.

## src/cluster.js

```javascript
// ======================================================
// CLUSTER / PARTITION / SUSPICIOUSNESS UI
// ======================================================

// Open clustering modal if a netlist is loaded
function openClusterModal() {
    if (netlistExists()) {
        openModal('clusterModal');
        toggleClusterParams();
    } else {
        showWarning('missingNetlistWarning');
    }
}


// Show only the parameter box for the currently selected clustering mode
function toggleClusterParams() {
    var algorithmSelect = document.getElementById('clusteringSelect');
    var selectedAlgorithm = algorithmSelect.value;
    var selectedBox = document.getElementById(selectedAlgorithm + 'Params');
    var paramBoxes = document.getElementsByClassName('clusterparams');

    for (box of paramBoxes) {
        if (box === selectedBox) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    }
}


// ======================================================
// APPLY SELECTED CLUSTERING / HIGHLIGHTING MODE
// ======================================================

function applyLouvain() {
    var runSelect = document.getElementById("louvainRunSelect");
    var entrySelect = document.getElementById("louvainEntrySelect");

    setRegularCluster("louvain", runSelect.value, entrySelect.value - 1);

    // refreshFoldOptions();
}


function applyMCL() {
    var iterationSelect = document.getElementById('mclIterationSelect');
    var iteration = iterationSelect.value;

    setMCLCluster(iteration);

    // refreshFoldOptions();
}


function applyPartition() {
    var partitionSelect = document.getElementById("partitionSelect");
    var partition = partitionSelect.value;

    setPartition(partition);

    /// refreshFoldOptions();
}


function applyNSBM() {
    var runSelect = document.getElementById("nsbmRunSelect");
    var entrySelect = document.getElementById("nsbmEntrySelect");

    setRegularCluster("nsbm", runSelect.value, entrySelect.value - 1);

    // refreshFoldOptions();
}


function applyLeiden() {
    var runSelect = document.getElementById("leiden_modRunSelect");
    var entrySelect = document.getElementById("leiden_modEntrySelect");

    setRegularCluster("leiden_mod", runSelect.value, entrySelect.value - 1);

    // refreshFoldOptions();
}


function applySuspiciousness() {
    var suspiciousnessSelect = document.getElementById('suspiciousnessSelect');
    var mode = suspiciousnessSelect.value;

    setSuspiciousnessHeat(mode);

    closeModal("morphModal");
}


// ======================================================
// CLUSTER / PARTITION APPLICATION LOGIC
// ======================================================

// Apply run-based clustering data (e.g. Louvain, NSBM, Leiden)
// Entries are pre-parsed and stored in node.clusterData[method]
function setRegularCluster(method, run, entryIndex) {
    var { nodes, links } = Graph.graphData();

    nodes.forEach(n => {
        if (typeof n[method] !== "undefined") {
            var clusterData = n.clusterData[method];
            var entries = clusterData[run];

            if (entryIndex > entries.length) {
                n.group = -1;
                n.colorMode = 'none';
            } else {
                n.group = entries[entryIndex];
                n.colorMode = "group";
                n.prevColorMode = "group";
            }
        } else {
            n.group = -1;
            n.colorMode = 'none';
        }
    });

    assignLinkColors();
    readGroups();
    resetGroupDistances();
    removeClusterDistanceOptions();
    setClusterDistanceOptions();

    // getCenterNodes();

    if (Graph.appData.groups.length > 0) {
        Graph.appData.selectedGroup = Graph.appData.groups[0];
    }

    Graph.appData.toolMode = "cluster";

    // Graph.appData.weightBackup = _.cloneDeep({ nodes, links });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// Apply MCL cluster assignment based on selected inflation / iteration value
function setMCLCluster(iteration) {
    var { nodes, links } = Graph.graphData();

    nodes.forEach(n => {
        if (typeof n.mcl !== 'undefined') {
            var parsed = n.mcl.split(', ');

            if (typeof parsed.find(el => el.includes(iteration.toString())) !== 'undefined') {
                var str = parsed.find(el => el.includes(iteration.toString()));
                var clusterNumber = parseInt(str.split('_')[3]);

                n.group = clusterNumber;
                n.colorMode = 'group';
                n.prevColorMode = 'group';
            } else {
                n.group = -1;
                n.colorMode = 'none';
            }
        } else {
            n.group = -1;
            n.colorMode = 'none';
        }
    });

    assignLinkColors();
    readGroups();
    resetGroupDistances();
    removeClusterDistanceOptions();
    setClusterDistanceOptions();

    // getCenterNodes();

    if (Graph.appData.groups.length > 0) {
        Graph.appData.selectedGroup = Graph.appData.groups[0];
    }

    Graph.appData.toolMode = "cluster";

    // Graph.appData.weightBackup = _.cloneDeep({ nodes, links });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// Highlight all nodes belonging to a selected partition
function setPartition(part) {
    const { nodes, links } = Graph.graphData();

    nodes.forEach(n => {
        if (typeof n.partition !== "undefined") {
            if (n.partition.includes(part)) {
                n.group = 0;
                n.colorMode = 'group';
                n.prevColorMode = 'group';
            } else {
                n.group = -1;
                n.colorMode = 'none';
            }
        } else {
            n.group = -1;
            n.colorMode = 'none';
        }
    });

    assignLinkColors();
    readGroups();
    resetGroupDistances();
    removeClusterDistanceOptions();
    setClusterDistanceOptions();

    // getCenterNodes();

    if (Graph.appData.groups.length > 0) {
        Graph.appData.selectedGroup = Graph.appData.groups[0];
    }

    Graph.appData.toolMode = "cluster";

    // Graph.appData.weightBackup = _.cloneDeep({ nodes, links });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// Apply suspiciousness heatmap coloring
function setSuspiciousnessHeat(selected) {
    const { nodes, links } = Graph.graphData();

    switch (selected) {
        case 'Minimum':
            var mode = 'susp_min';
            break;

        case 'Mean':
            var mode = 'susp_mean';
            break;

        case 'Maximum':
            var mode = 'susp_max';
            break;

        default:
            var mode = 'susp_max';
            break;
    }

    nodes.forEach(n => {
        if (typeof n[mode] !== 'undefined') {
            if (typeof n[mode] !== 'number') {
                n.suspiciousness = parseFloat(n[mode]);
            } else {
                n.suspiciousness = n[mode];
            }

            n.colorMode = 'suspiciousnessHeat';
        } else {
            n.colorMode = 'none';
        }
    });

    assignLinkColors();

    Graph.appData.toolMode = "none";
    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// ======================================================
// DATA EXTRACTION / OPTION PREPARATION
// ======================================================

// Example formats:
// "run_0_cluster_2"
// "run_0_cluster_18, run_0_cluster_20"
// "run_0_cluster_6"

// Parse run-based cluster metadata from node attributes
function getRegularClusterData(method) {
    const { nodes, links } = Graph.graphData();

    var runs = [];
    var entryCounts = {};

    nodes.forEach(n => {
        if (typeof n[method] !== 'undefined') {
            var parsed = n[method].split(', ');
            var tmpEntryCounts = {};

            for (let i = 0; i < parsed.length; i++) {
                var clusterData = n.clusterData[method];
                var str = parsed[i];
                var run = parseInt(str.split("_")[1]);

                if (typeof clusterData[run] === "undefined") {
                    clusterData[run] = [];
                }

                var cluster = parseInt(str.split("_")[3]);

                if (runs.indexOf(run) === -1) {
                    runs.push(run);
                }

                clusterData[run].push(cluster);

                if (typeof entryCounts[run] === "undefined") {
                    entryCounts[run] = 0;
                }

                if (typeof tmpEntryCounts[run] === "undefined") {
                    tmpEntryCounts[run] = 1;
                } else {
                    tmpEntryCounts[run]++;
                }
            }

            for (run of Object.keys(entryCounts)) {
                if (tmpEntryCounts[run] > entryCounts[run]) {
                    entryCounts[run] = tmpEntryCounts[run];
                }
            }
        } else {
            n.clusterData[method] = "unknown";
        }
    });

    runs.sort((a, b) => a - b);

    Graph.appData.clusterRuns[method] = runs;
    Graph.appData.clusterEntryCounts[method] = entryCounts;
}


// Parse available MCL iteration / inflation values
function getMCLIterations() {
    const { nodes, links } = Graph.graphData();

    var iterations = [];

    nodes.forEach(n => {
        if (typeof n.mcl !== 'undefined') {
            var parsed = n.mcl.split(', ');

            for (let i = 0; i < parsed.length; i++) {
                var str = parsed[i];
                var iteration = parseFloat(str.split('_')[1]);

                if (iterations.indexOf(iteration) === -1) {
                    iterations.push(iteration);
                }
            }
        }
    });

    iterations.sort((a, b) => a - b);

    Graph.appData.clusterIterations["mcl"] = iterations;
}


/*
    Partition examples:
    "top+iBAUD, @top"
    "top+iRECEIVER, @top"
    "top+iXMIT, @top"
    "top+iXMIT, @top, top+iXMIT+iTROJ"
*/

// Read all partition identifiers occurring in the loaded netlist
function getPartitionData() {
    const { nodes, links } = Graph.graphData();

    var partitions = [];

    nodes.forEach(n => {
        if (typeof n.partition !== "undefined") {
            var commaParse = n.partition.split(", ");

            for (c of commaParse) {
                var plusParse = c.split("+");

                for (p of plusParse) {
                    if (partitions.indexOf(p) === -1) {
                        partitions.push(p);
                    }
                }
            }
        }
    });

    Graph.appData.partitions = partitions;
}


// Read available suspiciousness modes from node attributes
function getSuspiciousnessOptions() {
    const { nodes, links } = Graph.graphData();

    var options = [];

    nodes.forEach(n => {
        if (typeof n.susp_min !== 'undefined' && options.indexOf('Minimum') === -1) {
            options.push('Minimum');
        }

        if (typeof n.susp_mean !== 'undefined' && options.indexOf('Mean') === -1) {
            options.push('Mean');
        }

        if (typeof n.susp_max !== 'undefined' && options.indexOf('Maximum') === -1) {
            options.push('Maximum');
        }
    });

    return options;
}


// Collect currently active group ids from the graph
function readGroups() {
    var { nodes, links } = Graph.graphData();
    var groups = [];

    nodes.forEach(n => {
        if (groups.indexOf(n.group) === -1 && n.group !== -1) {
            groups.push(n.group);
        }
    });

    Graph.appData.groups = groups;
}
```
---

## src/export.js

```javascript
// ======================================================
// EXPORT MODULE
// Handles project, graph, netlist, and library exports
// ======================================================


// ======================================================
// EXPORT ACTIONS
// ======================================================

// Export the full project state
function exportProject() {
    var projectName = document.getElementById("projectName").value;

    if (projectName !== "") {
        Graph.appData.projectName = projectName;
    }

    var data = { "Graph": Graph };
    var name = `exported_${Graph.appData.projectName}`;

    exportFile(data, name);
    closeModal("projectNameModal");
}


// Export current rendered graph data
function exportGraph() {
    var data = Graph.graphData();
    var name = `exported_${Graph.appData.netlistFile}_graph`;

    exportFile(data, name);
}


// Export netlist in reduced/original-style JSON format
function exportNetlist() {
    var data = netlistData();
    var name = `exported_${Graph.appData.netlistFile}`;

    exportFile(data, name);
}


// Export currently loaded gate library
function exportLibrary() {
    var data = Graph.appData.libraryJSON;
    var name = `exported_${Graph.appData.libraryFile}`;

    exportFile(data, name);
}


// ======================================================
// GENERIC FILE EXPORT
// ======================================================

// Trigger browser-side JSON download
function exportFile(data, fileName) {
    var dataStr = JSON.stringify(data);
    var dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    var exportFileDefaultName = fileName;

    var linkElement = document.createElement('a');

    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}


// ======================================================
// EXPORT FORMATS
// ======================================================

// Reconstruct a reduced netlist export that preserves only
// the original netlist-relevant node and link properties
function netlistData() {
    var data = {
        "directed": true,
        "multigraph": false,
        "graph": {},
        "nodes": [],
        "links": []
    };

    var { nodes, links } = _.cloneDeep(Graph.graphData());

    const originalNodeProperties = [
        "partition",
        "mcl",
        "nsbm",
        "leiden_mod",
        "louvain",
        "susp_mean",
        "susp_max",
        "id"
    ];

    const originalLinkProperties = [
        "source",
        "target"
    ];

    nodes.forEach(n => {
        for (key of Object.keys(n)) {
            if (originalNodeProperties.indexOf(key) === -1) {
                delete n[key];
            }
        }

        data.nodes.push(n);
    });

    links.forEach(l => {
        for (key of Object.keys(l)) {
            if (originalLinkProperties.indexOf(key) === -1) {
                delete l[key];
            }
        }

        data.links.push(l);
    });

    return data;
}
```
---

## src/init.js

```javascript
// ======================================================
// INITIALIZATION MODULE
// Handles file input, graph setup, and data preparation
// ======================================================


// ======================================================
// FILE INPUT (NETLIST IMPORT)
// ======================================================

// Listen for netlist file upload
document.getElementById('netlistFile').addEventListener('change', function (e) {
    e = e || window.event;
    readGraphFile(e);
}, false);


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

                /*
                try {
                    var netlist = JSON.parse(e.target.result);
                    buildGraph(netlist);
                } catch(e) {
                    showWarning('importWarning');
                }
                */

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

    Graph
        .graphData(graphJSON)

        // ---------------- Rendering ----------------
        .warmupTicks(50)
        .cooldownTime(15000)
        .d3AlphaDecay(0.01)
        .d3VelocityDecay(0.01)
        .numDimensions(Graph.appData.dimensions)

        // ---------------- Visuals ----------------
        .nodeThreeObject(node => nodeTHREESettings(node))

        .linkDirectionalArrowLength(3.5)
        .linkDirectionalArrowRelPos(1)

        .linkColor(link => linkColorSettings(link))
        .linkWidth(link => linkWidthSettings(link))
        .linkOpacity(link => linkOpacitySettings(link))
        .linkOpacity(0.6)
        .linkCurvature(link => linkCurvatureSettings(link))

        // ---------------- Node Interaction ----------------
        .nodeLabel(node => `${node.id}`)
        .onNodeClick((node, evt) => focusOnNode(node))
        .onNodeRightClick((node, evt) => removeNodes([node.id]))

        // ---------------- Background Interaction ----------------
        .onBackgroundRightClick(evt => resetCamera());

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

        addSelectOptions('clusteringSelect', getClusteringOptions());
        addSelectOptions('mclIterationSelect', Graph.appData.clusterIterations.mcl);
        addSelectOptions('suspiciousnessSelect', getSuspiciousnessOptions());
        addSelectOptions('partitionSelect', Graph.appData.partitions);

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

    nodes.forEach(n => {

        n.colorMode = 'none';
        n.prevColorMode = 'none';

        if (typeof n.function === 'undefined') n.function = 'unknown';

        n.type = 'unknown';
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

    links.forEach(l => {
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

    links.forEach(l => {
        l.target.pred.push(l.source.id);
    });
}


// Assign outgoing edges
function assignNodeSucc() {

    var { nodes, links } = Graph.graphData();

    links.forEach(l => {
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

    nodes.forEach(n => {

        if (typeof n.louvain !== 'undefined' && !louvainFound) louvainFound = true;
        if (typeof n.mcl !== 'undefined' && !mclFound) mclFound = true;
        if (typeof n.partition !== 'undefined' && !partitionsFound) partitionsFound = true;
        if (typeof n.nsbm !== 'undefined' && !nsbmFound) nsbmFound = true;
        if (typeof n.leiden_mod !== 'undefined' && !leidenFound) leidenFound = true;

        if (
            (
                typeof n.susp_mean !== 'undefined' ||
                typeof n.susp_min !== 'undefined' ||
                typeof n.susp_max !== 'undefined'
            ) && !suspFound
        ) {
            suspFound = true;
        }
    });

    if (louvainFound) options.push("Louvain");
    if (mclFound) options.push('MCL');
    if (partitionsFound) options.push('Partition');
    if (nsbmFound) options.push('NSBM');
    if (leidenFound) options.push('Leiden');
    if (suspFound) options.push('Suspiciousness');

    return options;
}


// ======================================================
// STRUCTURE ANALYSIS
// ======================================================

// Compute structural relationships (same-function neighbors)
function setStructureCounts() {

    var { nodes, links } = Graph.graphData();

    for (node of nodes) {

        if (node.function !== 'unknown') {

            var pred = nodes.filter(n => node.pred.indexOf(n.id) !== -1);
            var succ = nodes.filter(n => node.succ.indexOf(n.id) !== -1);

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

    nodes.forEach(node => {

        if (typeof node.function === 'undefined' || node.function === 'unknown') {

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

    nodes.forEach(node => {

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
```
---

## src/interface.js

```javascript
// ======================================================
// INTERFACE MODULE
// Handles UI interaction, modals, and DOM utilities
// ======================================================


// ======================================================
// SIDEBAR
// ======================================================

// Toggle sidebar visibility
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}


// Toggle submenu visibility
function toggleSubmenu(id) {
    document.getElementById(id).classList.toggle('active');
}


// Toggle submenu entry text (e.g. Freeze / Unfreeze)
function toggleSubmenuLabel(id, name1, name2) {
    var el = document.getElementById(id);

    if (el.innerHTML === name1) {
        el.innerHTML = name2;
    } else if (el.innerHTML === name2) {
        el.innerHTML = name1;
    }
}


// ======================================================
// MODAL DRAGGING
// ======================================================

// Enable drag functionality for modals
function makeModalDraggable(modal, modalMenu) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    modalMenu.onmousedown = dragMouseDown;
    modal.onmousedown = null;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;

        pos3 = e.clientX;
        pos4 = e.clientY;

        modal.style.top = (modal.offsetTop - pos2) + 'px';
        modal.style.left = (modal.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


/*
    Modal IDs reference:

    'warningModal'          -> warnings
    'cameraPointsModal'     -> camera points
    'graphStatsModal'       -> graph statistics
    'newLibraryModal'       -> create library
    'showLibraryModal'      -> display library
    'importEntryModal'      -> add entry
    'removeEntryModal'      -> remove entry
    'helpModal'             -> help
*/


// ======================================================
// MODAL CONTROL
// ======================================================

// Open modal and enable dragging
function openModal(id) {

    var modal = document.getElementById(id);
    var modalMenu = document.getElementById(id + 'Menu');

    modal.classList.add('fade');

    if (!modal.hasAttribute('draggable')) {
        makeModalDraggable(modal, modalMenu);
    }
}


// Close modal
function closeModal(id) {
    document.getElementById(id).classList.remove('fade');
}


// Close all modals
function closeAllModals() {

    var modals = document.getElementsByClassName("modal");

    for (mod of modals) {
        closeModal(mod.id);
    }
}


// ======================================================
// SELECT FIELD UTILITIES
// ======================================================

// Add options to select element
function addSelectOptions(id, ops) {

    var selectField = document.getElementById(id);

    for (op of ops) {

        var optionTag = new Option(op);
        optionTag.classList.add("addedOption");

        selectField.options.add(optionTag);
    }
}


// Remove specific option from select
function removeSelectOption(id, option) {

    var selectField = document.getElementById(id);

    for (op of selectField.options) {
        if (op.value === option) op.remove();
    }
}


// Remove all dynamically added options
function clearAllSelectFields() {

    var addedOptions = document.getElementsByClassName("addedOption");

    for (var i = addedOptions.length - 1; i >= 0; --i) {
        addedOptions[i].remove();
    }
}


// ======================================================
// DATA AVAILABILITY CHECKS
// ======================================================

// Check if netlist is loaded
function netlistExists() {
    return window.Graph.appData.netlistJSON !== null;
}


// Check if library is loaded
function libraryExists() {
    return window.Graph.appData.libraryJSON !== null;
}


// ======================================================
// MODAL STATE MANAGEMENT
// ======================================================

// Hide all warnings inside warning modal
function clearPreviousWarnings() {

    var warnings = document.getElementsByClassName('warning');

    for (warning of warnings) {
        warning.style.display = 'none';
    }
}


// Hide all modal option sections
function clearModalOptions() {

    var options = document.getElementsByClassName('modalOption');

    for (op of options) {
        op.style.display = 'none';
    }
}


// Show specific modal option section
function showModalOption(optionID) {
    var option = document.getElementById(optionID);
    option.style.display = "block";
}


// ======================================================
// WARNING SYSTEM
// ======================================================

// Display warning modal with selected message
function showWarning(warningID, option) {

    option = option || null;

    /*
        warningIDs:

        'importWarning'            -> invalid file format
        'existingLibraryWarning'   -> library already exists
        'missingLibraryWarning'    -> no library loaded
    */

    var warningModal = document.getElementById('warningModal');
    var warningModalMenu = document.getElementById('warningModalMenu');

    clearPreviousWarnings();
    clearModalOptions();

    warningModal.classList.add('fade');

    document.getElementById(warningID).style.display = 'inline-block';

    makeModalDraggable(warningModal, warningModalMenu);

    if (option !== null) {
        document.getElementById(option + 'Next').style.display = 'block';
    }
}


// ======================================================
// WINDOW EVENTS
// ======================================================

// Resize graph canvas with window
window.addEventListener('resize', function () {

    Graph.width(window.innerWidth);
    Graph.height(window.innerHeight);

}, false);
```
---

## src/layout.js

```javascript
// ======================================================
// LAYOUT MODULE
// Handles cluster layout transformations (expansion / separation)
// ======================================================


// ======================================================
// UI ENTRY
// ======================================================

// Open layout modal (only if clustering is active)
function openLayoutModal() {
    if (Graph.appData.toolMode === "cluster") {
        openModal("morphModal");
    } else {
        showWarning("noClusterWarning");
    }
}


// ======================================================
// LAYOUT MODE HANDLING
// ======================================================

// Apply selected layout mode (expansion vs. separation)
function applyLayoutOption() {
    var { nodes, links } = Graph.graphData();

    var layoutOptionSelect = document.getElementById("clusterLayoutSelect");
    var selected = layoutOptionSelect.value;

    showLayoutOption(selected);

    switch (selected) {

        case "weight":

            // Reset previous split if switching mode
            if (Graph.appData.layoutMode !== "weight") {
                resetSplit();
            }

            Graph.appData.layoutMode = "weight";
            break;

        case "force":

            Graph.appData.layoutMode = "force";
            splitCluster();
            break;
    }
}


// Show corresponding UI parameters for selected layout mode
function showLayoutOption(selected) {
    var options = document.getElementsByClassName("layoutOption");

    for (op of options) {

        if (op.id === `${selected}Params`) {
            op.style.display = "";
        } else {
            op.style.display = "none";
        }
    }
}


// ======================================================
// GROUP SELECTION / UI SYNC
// ======================================================

// Update selected cluster group from dropdown
function refreshSelectedGroup() {
    var clusterSelect = document.getElementById("clusterDistanceSelect");
    var morphSlider = document.getElementById("morphSlider");

    var group = parseInt(clusterSelect.value);

    Graph.appData.selectedGroup = group;

    morphSlider.value = Graph.appData.groupDistances[group];
}


// Remove all cluster distance options from UI
function removeClusterDistanceOptions() {
    var options = document.getElementsByClassName("clusterDistanceOption");

    for (op of options) {
        op.remove();
    }
}


// ======================================================
// CLUSTER LAYOUT TRANSFORMATIONS
// ======================================================

// Separate clusters by modifying link structure
function splitCluster() {
    var { nodes, links } = Graph.graphData();

    // Reset center force
    Graph.d3Force("center");

    // Remove inter-cluster links marked with group = -2
    links = links.filter(l => l.group !== -2);

    Graph.graphData({ nodes, links });
}


// Slider handler for adjusting cluster distances
function slideGroupDistance() {
    var slider = document.getElementById("morphSlider");
    var groupSelect = document.getElementById("clusterDistanceSelect");

    setGroupDistance(groupSelect.value, slider.value);
}


// Sync slider with currently selected group distance
function refreshMorphSlider() {
    var slider = document.getElementById("morphSlider");

    var group = Graph.appData.selectedGroup;
    var value = Graph.appData.groupDistances[group];

    slider.value = value;
}


// ======================================================
// FORCE CONFIGURATION
// ======================================================

// Adjust link distances per cluster group
function setGroupDistance(group, distance) {
    Graph
        .d3Force("link")
        .distance(l => {

            // Selected group → apply custom distance
            if (l.group === group) {

                Graph.appData.groupDistances[group] = distance;
                return distance;

            // Other known groups → use stored values
            } else if (Graph.appData.groups.indexOf(l.group) !== -1) {

                if (typeof Graph.appData.groupDistances[l.group] === "undefined") {
                    Graph.appData.groupDistances[l.group] = Graph.appData.groupDistances.default;
                }

                return Graph.appData.groupDistances[l.group];

            // Default fallback
            } else {
                return Graph.appData.groupDistances.default;
            }

        });

    Graph.numDimensions(Graph.appData.dimensions);
}
```
---

## src/library.js

```javascript
// ======================================================
// LIBRARY MODULE
// Handles gate library import, editing, navigation, and sample libraries
// ======================================================


// ======================================================
// FILE INPUT (LIBRARY IMPORT)
// ======================================================

document.getElementById('libraryFile').addEventListener('change', function (e) {
    e = e || window.event;
    readLibraryFile(e);
}, false);


// Read and parse uploaded library file
function readLibraryFile(e) {
    if (e.target.files.length === 1) {

        var file = e.target.files[0];
        Graph.appData.libraryFile = file.name;

        var reader = new FileReader();

        reader.onload = (function () {

            return function (e) {

                Graph.appData.libraryJSON = JSON.parse(e.target.result);

                readLibraryTypes();

                if (Graph.appData.netlistJSON !== null) {
                    assignNodeFunctions();
                    assignNodeTypes();
                }
            };

        })(file);

        reader.readAsText(file);
    }
}


// ======================================================
// LIBRARY EDITOR
// ======================================================

// Open modal for adding a new library entry
function openLibraryEntryEditor() {
    if (window.Graph.libraryJSON === null) {

        showWarning('missingLibraryWarning');

    } else {

        try {

            addSelectOptions('addCellType', window.Graph.appData.libraryTypes);
            addSelectOptions('addCellFunction', window.Graph.appData.libraryFunctions);

            openModal('importEntryModal');

        } catch (e) {

            showWarning('importWarning');

        }
    }
}


// Add new cell to current library
function addCell() {
    var cellName = document.getElementById("addCellName");
    var cellFunction = document.getElementById("addCellFunction");
    var cellType = document.getElementById("addCellType");

    var newCell = new Cell(cellName.value, cellFunction.value, cellType.value);

    Graph.appData.libraryJSON.cells.push(newCell);

    if (Graph.appData.libraryJSON.cells.length === 1) {

        Graph.appData.libraryCellCounter = 1;

        showLibraryCell(1);
        refreshCellView();
    }

    refreshCellNavigation();
    refreshMissingEntries();
    refreshCellCount();

    cellName.value = "";
}


// Toggle "new function" editor section
function toggleFunctionOption() {
    var cellSelect = document.getElementById("cellFunctionOption");
    var newFunctionInput = document.getElementById("newFunctionOption");

    if (newFunctionInput.style.display === "none") {

        cellSelect.style.display = "none";
        newFunctionInput.style.display = "block";

    } else if (newFunctionInput.style.display === "block") {

        cellSelect.style.display = "block";
        newFunctionInput.style.display = "none";

    }
}


// Toggle "new type" editor section
function toggleTypeOption() {
    var cellSelect = document.getElementById("cellTypeOption");
    var newTypeInput = document.getElementById("newTypeOption");

    if (newTypeInput.style.display === "none") {

        cellSelect.style.display = "none";
        newTypeInput.style.display = "block";

    } else if (newTypeInput.style.display === "block") {

        cellSelect.style.display = "block";
        newTypeInput.style.display = "none";

    }
}


// Add new gate function to library
function addCellFunction() {
    var functionInput = document.getElementById("newFunction");

    Graph.appData.libraryJSON.functions.push(functionInput.value);
    addSelectOptions('addCellFunction', [functionInput.value]);

    toggleFunctionOption();
}


// Add new gate type to library
function addCellType() {
    var cellInput = document.getElementById("newType");

    Graph.appData.libraryTypes.push(cellInput.value);
    addSelectOptions('addCellType', [cellInput.value]);

    toggleTypeOption();
}


// Remove currently selected gate function
function removeCellFunction() {
    var functionSelect = document.getElementById("addCellFunction");
    var index = Graph.appData.libraryJSON.functions.indexOf(functionSelect.value);

    Graph.appData.libraryJSON.functions.splice(index, 1),
    addSelectOptions('addCellFunction', window.Graph.appData.libraryFunctions);
}


// Remove currently selected gate type
function removeCellType() {
    var functionSelect = document.getElementById("addCellType");
    var index = Graph.appData.libraryTypes.indexOf(functionSelect.value);

    Graph.appData.libraryTypes.splice(index, 1),
    addSelectOptions('addCellType', window.Graph.appData.libraryTypes);
}


// Apply current library to loaded netlist
function applyLibrary() {
    readLibraryFunctions();
    readLibraryTypes();

    assignNodeFunctions();
    assignNodeTypes();

    assignNodePred();
    assignNodeSucc();
    setStructureCounts();

    refreshMissingEntries();
    refreshGraph();
}


// ======================================================
// LIBRARY DATA TYPES
// ======================================================

function Cell(name, funct, type) {
    this.name = name;
    this.function = funct;
    this.type = type;
}


function Library(name) {
    this.name = name;
    this.functions = new Array();
    this.cells = new Array();
}


// ======================================================
// LIBRARY CREATION
// ======================================================

// Create a new empty library
function openNewLibraryModal() {
    if (!libraryExists()) {
        openModal('newLibraryModal');
    } else {
        showWarning('existingLibraryWarning', 'newLibrary');
    }
}


// Create library object from input field
function createNewLibrary() {
    var nameInput = document.getElementById('newLibraryName');
    var libraryName = nameInput.value;

    setNewLibrary(libraryName);
}


// Set current library instance
function setNewLibrary(name) {
    Graph.appData.libraryJSON = new Library(name);
}


// ======================================================
// LIBRARY VIEW / NAVIGATION
// ======================================================

// Show next library cell
function showNextCell() {
    if (Graph.appData.libraryCellCounter < Graph.appData.libraryJSON.cells.length) {
        Graph.appData.libraryCellCounter++;

        showLibraryCell(Graph.appData.libraryCellCounter);
        refreshCellCount();
        refreshCellNavigation();
    }
}


// Show previous library cell
function showPrevCell() {
    if (Graph.appData.libraryCellCounter > 1) {
        Graph.appData.libraryCellCounter--;

        showLibraryCell(Graph.appData.libraryCellCounter);
        refreshCellCount();
        refreshCellNavigation();
    }
}


// Open library viewer
function openLibraryViewer() {
    openModal('showLibraryModal');

    refreshCellCount();
    refreshCellNavigation();
    showLibraryCell(Graph.appData.libraryCellCounter);
}


// Update previous / next navigation state
function refreshCellNavigation() {
    var nextButton = document.getElementById("nextCell");
    var prevButton = document.getElementById("prevCell");

    if (Graph.appData.libraryCellCounter < Graph.appData.libraryJSON.cells.length) {
        nextButton.classList.add("active");
    } else {
        nextButton.classList.remove("active");
    }

    if (Graph.appData.libraryCellCounter > 1) {
        prevButton.classList.add("active");
    } else {
        prevButton.classList.remove("active");
    }
}


// Update displayed entry count
function refreshCellCount() {
    var entryCount = document.getElementById("entryCount");
    var entryIndex = document.getElementById("entryIndex");

    entryIndex.innerHTML = Graph.appData.libraryCellCounter;
    entryCount.innerHTML = Graph.appData.libraryJSON.cells.length;
}


// Show / hide empty library warning
function refreshCellView() {
    var warning = document.getElementById("noCellWarning");
    var show = document.getElementById("showCell");
    var navigation = document.getElementById("cellNavigation");

    if (Graph.appData.libraryJSON.cells.length > 0) {

        warning.style.display = "none";
        show.style.display = "block";
        navigation.style.display = "block";

    } else if (Graph.appData.libraryJSON.cells.length === 0) {

        warning.style.display = "block";
        show.style.display = "none";
        navigation.style.display = "none";

    }
}


// Delete current cell from library
function deleteCell() {
    Graph.appData.libraryJSON.cells.splice(Graph.appData.libraryCellCounter - 1, 1);

    if (Graph.appData.libraryCellCounter === Graph.appData.libraryJSON.cells.length) {

        if (Graph.appData.libraryJSON.cells.length > 1) {

            Graph.appData.libraryCellCounter--;

        } else if (Graph.appData.libraryCellCounter > 1) {

            showLibraryCell(Graph.appData.libraryCellCounter - 1);

        }

    } else {

        if (Graph.appData.libraryCellCounter > 1) {

            Graph.appData.libraryCellCounter--;
            showLibraryCell(Graph.appData.libraryCellCounter);

        } else if (Graph.appData.libraryJSON.cells.length === 1) {

            showLibraryCell(0);

        }

    }

    refreshCellView();
    refreshCellCount();
    refreshCellNavigation();
}


// Display one library cell by index
function showLibraryCell(index) {
    var cells = Graph.appData.libraryJSON.cells;

    var nameSpan = document.getElementById("cellName");
    var functionSpan = document.getElementById("cellFunction");
    var typeSpan = document.getElementById("cellType");

    index--;

    if (index < cells.length && index > -1) {

        nameSpan.innerHTML = cells[index].name;
        functionSpan.innerHTML = cells[index].function;
        typeSpan.innerHTML = cells[index].type;

    }
}


// ======================================================
// MISSING ENTRIES
// ======================================================

// Find all netlist cell names that are not covered by the current library
function findMissingEntries() {
    var { nodes, links } = Graph.graphData();
    var missing = [];

    nodes.forEach(n => {

        if (n.function === "unknown") {

            if (n.id.includes("_")) {

                var splitID = n.id.split("_");
                var missingID = "";

                for (let i = 0; i < splitID.length - 1; i++) {
                    missingID = missingID + splitID[i];
                }

                if (missing.indexOf(missingID) === -1) missing.push(missingID);

            } else if (missing.indexOf(n.id) === -1) {

                missing.push(n.id);

            }

        }

    });

    return missing;
}


// Open missing entries modal
function showMissingEntries() {
    refreshMissingEntries();
    openModal("missingEntriesModal");
}


// Refresh missing entries list in UI
function refreshMissingEntries() {
    var missing = findMissingEntries();
    var list = document.getElementById("missingEntries");

    list.innerHTML = '<li>' + missing.join('</li><li>') + '</li>';
}
```
