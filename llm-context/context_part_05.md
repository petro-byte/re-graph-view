# Repository Context Part 5/5

Generated for LLM prompt context.

## src/main.js

```javascript
// ======================================================
// MAIN MODULE
// Creates the global 3D force graph instance and stores
// shared application state in Graph.appData
// ======================================================


// Graph container element
let graphContainer = document.getElementById('3d-graph');


// Initialize 3D force graph
let Graph = ForceGraph3D({
    controlType: 'trackball',
    rendererConfig: {
        antialias: true,
        alpha: true,
        precision: "lowp"
    }
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
    netlistFile: '',

    // --------------------------------------------------
    // Library data
    // --------------------------------------------------
    libraryJSON: null,
    libraryTypes: [],
    libraryFunctions: [],
    libraryFile: '',
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
        "Initial": {
            lookAt: { x: 0, y: 0, z: 0 },
            x: 0,
            y: 0,
            z: 1000
        }
    },

    // --------------------------------------------------
    // Clustering metadata
    // --------------------------------------------------
    clusterRuns: {
        louvain: [],
        nsbm: [],
        leiden_mod: []
    },

    clusterIterations: {
        mcl: []
    },

    clusterEntryCounts: {
        louvain: {},
        nsbm: {},
        leiden_mod: {}
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
    groupDistances: { "default": 40 },
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
    lookAtNodes: []
};


// Expose graph globally
window.Graph = Graph;
```
---

## src/sample.js

```javascript
// ======================================================
// SAMPLE MODULE
// Handles loading of sample netlists and sample libraries
// ======================================================


// ======================================================
// CONFIGURATION
// Set these paths to your actual external sample library files
// ======================================================

const SAMPLE_LIBRARY_PATH = './data/libraries/osu035.json';
const SAMPLE_LIBRARY_EXTENDED_PATH = 'data/libraries/osu035_extended.json';

const SAMPLE_LIBRARY_FILE_NAME = 'osu035.json';
const SAMPLE_LIBRARY_EXTENDED_FILE_NAME = 'osu035_extended.json';


// ======================================================
// UI ENTRY
// ======================================================

// Load selected sample netlist and optionally the sample library
function selectSample() {
    var sampleSelect = document.getElementById('sampleSelect');
    var libraryCheckbox = document.getElementById('sampleLibraryCheckbox');

    window.loadSample(sampleSelect.value, libraryCheckbox.checked);
}


// ======================================================
// SAMPLE LIBRARY LOADING
// ======================================================

// Load default sample library into application state
async function loadSampleLibrary() {
    try {
        await loadExternalLibrary(
            SAMPLE_LIBRARY_EXTENDED_PATH,
            SAMPLE_LIBRARY_EXTENDED_FILE_NAME
        );

        closeModal("importEntryModal");
        closeModal("showLibraryModal");
        closeModal("newLibraryModal");

        applyLibrary();

    } catch (error) {
        console.error('Failed to load sample library:', error);
        showWarning('importWarning');
    }
}


// Generic helper for loading a library JSON file
async function loadExternalLibrary(path, fileName) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load library: ${path}`);
    }

    const json = await response.json();

    Graph.appData.libraryJSON = json;
    Graph.appData.libraryFile = fileName;

    return json;
}


// ======================================================
// SAMPLE NETLIST LOADING
// ======================================================

// Load bundled sample netlist from default sample directory
async function loadSample(sample, readSampleLibrary) {
    try {
        if (readSampleLibrary) {
            await loadExternalLibrary(
                SAMPLE_LIBRARY_EXTENDED_PATH,
                SAMPLE_LIBRARY_EXTENDED_FILE_NAME
            );
        }

        const response = await fetch('data/designs/' + sample);

        if (!response.ok) {
            throw new Error(`Failed to load sample netlist: ${sample}`);
        }

        const json = await response.json();

        Graph.appData.netlistJSON = json;
        Graph.appData.netlistFile = sample;

        forceGraphSettings(json);
        Graph.appData.dataSet = false;

    } catch (error) {
        console.error('Failed to load sample:', error);
        showWarning('importWarning');
    }
}


// Load netlist from arbitrary path
async function loadNetlist(sample, readSampleLibrary) {
    try {
        if (readSampleLibrary) {
            await loadExternalLibrary(
                SAMPLE_LIBRARY_EXTENDED_PATH,
                SAMPLE_LIBRARY_EXTENDED_FILE_NAME
            );
        }

        const response = await fetch(sample);

        if (!response.ok) {
            throw new Error(`Failed to load netlist: ${sample}`);
        }

        const json = await response.json();

        Graph.appData.netlistJSON = json;
        Graph.appData.netlistFile = sample;

        forceGraphSettings(json);
        Graph.appData.dataSet = false;

    } catch (error) {
        console.error('Failed to load netlist:', error);
        showWarning('importWarning');
    }
}
```
---

## src/setters.js

```javascript
// ======================================================
// SETTERS / RESET MODULE
// Handles graph resets, color assignments, and layout resets
// ======================================================


// ======================================================
// STRUCTURE RESET
// ======================================================

// Reset all structure-related coloring and IDs
function resetStructures() {

    var { nodes, links } = Graph.graphData();

    nodes.forEach(n => {

        n.colorMode = node.prevColorMode; // original behavior kept
        n.structureID = -1;

    });

    links.forEach(l => {

        l.colorMode = "none";
        l.structureID = -1;

    });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// ======================================================
// LINK COLOR ASSIGNMENT
// ======================================================

// Assign link colors based on structure or cluster grouping
function assignLinkColors() {

    var { nodes, links } = Graph.graphData();

    links.forEach(l => {

        // Structure-based coloring
        if (
            l.target.structureID === l.source.structureID &&
            l.target.colorMode === "structure" &&
            l.source.colorMode === "structure"
        ) {

            l.colorMode = "structure";
            l.colorID = l.source.structureID;

        // Cluster-based coloring
        } else if (
            l.target.group === l.source.group &&
            l.target.colorMode === 'group' &&
            l.target.colorMode === 'group'
        ) {

            l.colorMode = "group";
            l.group = l.source.group;
            l.colorID = l.source.group;

        // Inter-cluster links
        } else if (l.source.group !== l.target.group) {

            l.group = -2;
            l.colorID = -2;

        // Default fallback
        } else {

            l.group = -1;
            l.colorID = -1;

        }

    });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// ======================================================
// GROUP DISTANCE RESET
// ======================================================

// Reset all cluster distance values and UI sliders
function resetGroupDistances() {

    var morphSlider = document.getElementById("morphSlider");
    var distanceSlider = document.getElementById("distanceSlider");
    var clusterSliderContainer = document.getElementById("clusterSliderContainer");

    // Reset link force distances
    Graph
        .d3Force("link")
        .distance(l => {
            return Graph.appData.groupDistances.default;
        });

    // Reset stored distances per group
    for (group of Graph.appData.groups) {
        Graph.appData.groupDistances[group] = Graph.appData.groupDistances.default;
    }

    // Reset UI sliders
    morphSlider.value = 40;
    distanceSlider.value = 40;

    clusterSliderContainer.style.display = "block";

    Graph.numDimensions(Graph.appData.dimensions);
}


// ======================================================
// GRAPH RESET
// ======================================================

// Reset graph to original netlist state
function resetGraph() {

    var { nodes, links } = Object.assign({}, Graph.appData.netlistJSON);

    nodes.forEach(n => {

        n.group = -1;
        n.colorMode = "none";
        n.prevColorMode = "none";

    });

    links.forEach(l => {

        l.colorID = -1;
        l.colorMode = "none";

    });

    resetGroupDistances();

    Graph
        .graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}


// ======================================================
// LAYOUT / STRUCTURE RESET HELPERS
// ======================================================

// Reset cluster split layout
function resetSplit() {

    var { nodes, links } = Object.assign({}, Graph.appData.netlistJSON);

    Graph
        .graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}


// Reset structure visualization
function resetStructure() {

    var { nodes, links } = Object.assign({}, Graph.appData.netlistJSON);

    Graph
        .graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}
```
---

## src/structures.js

```javascript
// ======================================================
// STRUCTURE DETECTION MODULE
// Detects structural patterns in the graph:
// - Chains
// - Loops
// - Trees
// - Automata-like structures
// ======================================================


// ======================================================
// UI ENTRY
// ======================================================

// Open structure modal and initialize options
function openStructureModal() {

    openModal("structureModal");

    if (typeof Graph.appData.libraryJSON.functions !== "undefined") {
        addSelectOptions("chainGateSelect", Graph.appData.libraryJSON.functions);
    }

    structureChange();
}


// Update visible parameter panel based on selected structure type
function structureChange() {

    var structureSelect = document.getElementById("structureSelect");
    var selected = structureSelect.value + "Params";

    clearModalOptions();
    showModalOption(selected);
}


// Apply selected structure detection algorithm
function setSelectedStructure() {

    resetStructures();

    var selected = document.getElementById("structureSelect").value;

    var minLength = document.getElementById(selected + "MinLength").value;
    var maxLength = document.getElementById(selected + "MaxLength").value;

    var minChildren = document.getElementById("treeMinChildren").value;
    var singleFanIn = document.getElementById("singleFanIn").checked;
    var chainGateFunction = document.getElementById("chainGateSelect").value;
    var inverseTree = document.getElementById("inverseTree").checked;
    var identicalLoopNodeFunctions = document.getElementById("identicalLoopNodeFunctions").checked;

    switch (selected) {

        case "chain":
            setChainStructures(minLength, maxLength, chainGateFunction);
            break;

        case "tree":
            setTreeStructures(minLength, maxLength, minChildren, singleFanIn, inverseTree);
            break;

        case "loop":
            setLoopStructures(minLength, maxLength, identicalLoopNodeFunctions);
            break;
    }

    assignLinkColors();
}


// ======================================================
// CHAIN DETECTION
// ======================================================

// Detect linear chains of nodes with identical functions
function setChainStructures(minLength, maxLength, gateFunction, markInBetweenLinks) {

    minLength = minLength ? minLength : 3;
    maxLength = maxLength ? maxLength : 20;
    gateFunction = gateFunction ? gateFunction : "all";
    markInBetweenLinks = markInBetweenLinks ? markInBetweenLinks : true;

    var { nodes, links } = Graph.graphData();

    var firstNodes = findChainStartCandidates(markInBetweenLinks);
    var chains = [];

    var structureID = 0;

    Graph.appData.lookAtNodes = [];

    firstNodes.forEach(node => {

        var chain = [node];
        var currentNode = node;
        var pushChain = true;

        // Traverse forward while chain continues
        while (currentNode.realSucc.length === 1) {

            currentNode = nodeById(currentNode.realSucc[0]);

            if (gateFunction === currentNode.function || gateFunction === "all") {
                chain.push(currentNode);
            }
        }

        // Avoid duplicate chains
        for (c of chains) {
            if (c[c.length - 1].id === chain[chain.length - 1].id) {
                pushChain = false;
            }
        }

        // Apply structure coloring if valid
        if (chain.length >= minLength && chain.length <= maxLength) {

            chain.forEach(n => {

                node.prevColorMode = node.colorMode;
                n.colorMode = "structure";
                n.structureID = structureID;

            });

            if (markInBetweenLinks) {
                links.forEach(l => {
                    if (chain.indexOf(l.source) !== -1 && chain.indexOf(l.target) !== -1) {
                        l.colorMode = "structure";
                    }
                });
            }

            structureID++;
            Graph.appData.lookAtNodes = Graph.appData.lookAtNodes.concat(chain);
            chains.push(chain);
        }
    });

    Graph.refresh().numDimensions(Graph.appData.dimensions);
    return chains;
}


// Find potential chain starting nodes
function findChainStartCandidates(markInBetweenLinks) {

    var { nodes } = Graph.graphData();
    var candidates = [];

    nodes.forEach(n => checkChainStartCandidate(n, candidates, markInBetweenLinks));

    return candidates;
}


// Check if node qualifies as chain start
function checkChainStartCandidate(node, candidates, markInBetweenLinks) {

    if (
        node.function !== 'unknown' &&
        node.realPred.length === 0 &&
        (
            node.realSucc.length === 1 ||
            (node.realSucc.length > 1 && markInBetweenLinks)
        )
    ) {
        candidates.push(node);
        return true;
    }

    return false;
}


// ======================================================
// LOOP DETECTION
// ======================================================

// Detect cyclic structures (loops)
function setLoopStructures(minLength, maxLength, identicalLoopNodeFunctions) {

    minLength = minLength ? minLength : 3;
    maxLength = maxLength ? maxLength : 20;
    identicalLoopNodeFunctions = identicalLoopNodeFunctions ? identicalLoopNodeFunctions : false;

    var candidates = findLoopNodeCandidates();
    var loops = [];
    var idCounter = 0;

    while (candidates.length > 0) {

        var baseNode = candidates.pop();
        var nextNode = baseNode.next;

        var loop = [baseNode, nextNode];

        candidates = candidates.filter(n => n !== nextNode);

        while (nextNode !== baseNode && typeof nextNode.next !== 'undefined') {

            nextNode = nextNode.next;
            candidates = candidates.filter(n => n !== nextNode);

            if (nextNode !== baseNode) loop.push(nextNode);
        }

        if (
            baseNode.realPred[0] === loop[loop.length - 1].id &&
            loop.length >= minLength &&
            loop.length <= maxLength
        ) {

            loops.push(loop);

            for (node of loop) {
                node.prevColorMode = node.colorMode;
                node.colorMode = "structure";
                node.structureID = idCounter;
            }

            idCounter++;
        }
    }

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// Find loop candidates (nodes with single predecessor and successor)
function findLoopNodeCandidates() {

    var { nodes } = Graph.graphData();
    var candidates = [];

    for (node of nodes) {

        if (
            node.function !== 'unknown' &&
            node.realPred.length === 1 &&
            node.realSucc.length === 1
        ) {

            node.prev = nodeById(node.realPred[0]);
            node.next = nodeById(node.realSucc[0]);

            candidates.push(node);
        }
    }

    return candidates;
}


// ======================================================
// TREE DETECTION
// ======================================================

// Detect hierarchical tree structures
function setTreeStructures(minLength, maxLength, minChildren, singleFanIn, inverseTree) {

    minLength = minLength ? minLength : 3;
    maxLength = maxLength ? maxLength : 20;
    minChildren = minChildren ? minChildren : 2;
    singleFanIn = singleFanIn ? singleFanIn : false;
    inverseTree = inverseTree ? inverseTree : false;

    var roots = findTreeRootNodeCandidates(inverseTree);
    var trees = [];

    var idCounter = 0;

    for (r of roots) {

        var root = r.root;
        var childFunction = r.childFunction;

        var tree = [root];
        var currentLayer = [root];
        var layerCount = 1;
        var nextLayer = [];

        // Breadth-first expansion
        while (currentLayer.length !== 0) {

            for (n of currentLayer) {

                if (n.realSucc.length >= minChildren && !inverseTree) {

                    for (s of n.succ) {

                        var succNode = nodeById(s);
                        var fanInCheck = singleFanIn ? (n.pred.length === 1) : true;

                        if (succNode.function === childFunction && fanInCheck) {
                            nextLayer.push(succNode);
                        }
                    }
                }

                if (n.realPred.length >= minChildren && inverseTree) {

                    for (p of n.pred) {

                        var predNode = nodeById(p);
                        var fanInCheck = singleFanIn ? (n.succ.length === 1) : true;

                        if (predNode.function === childFunction && fanInCheck) {
                            nextLayer.push(predNode);
                        }
                    }
                }
            }

            if (nextLayer.length > 0) layerCount++;

            tree = tree.concat(currentLayer);
            currentLayer = nextLayer;
            nextLayer = [];
        }

        if (layerCount >= minLength && layerCount <= maxLength) {

            for (node of tree) {
                node.prevColorMode = node.colorMode;
                node.colorMode = "structure";
                node.structureID = idCounter;
            }

            trees.push(tree);
            idCounter++;
        }
    }

    assignLinkColors();
    Graph.refresh().numDimensions(Graph.appData.dimensions);

    return trees;
}


// Identify valid tree root candidates
function findTreeRootNodeCandidates(inverseTree) {

    var { nodes } = Graph.graphData();
    var candidates = [];

    for (node of nodes) {

        if (node.function !== "unknown") {

            var functionCounts = {};
            var possibleSuccCount = 0;
            var treeChildFunction = "";

            // Count successor or predecessor functions
            var neighbors = inverseTree ? node.pred : node.succ;

            for (id of neighbors) {

                var neighborNode = nodeById(id);

                if (neighborNode.function !== "unknown") {

                    if (typeof functionCounts[neighborNode.function] === "undefined") {
                        functionCounts[neighborNode.function] = 1;
                    } else {
                        functionCounts[neighborNode.function]++;
                    }
                }
            }

            // Determine dominant child function
            for (f of Object.keys(functionCounts)) {

                if (functionCounts[f] > 1) {
                    possibleSuccCount++;
                    treeChildFunction = f;
                }
            }

            if (possibleSuccCount === 1) {
                candidates.push({
                    "root": node,
                    "childFunction": treeChildFunction
                });
            }
        }
    }

    return candidates;
}
```
---

## src/utils.js

```javascript
// ======================================================
// UTILITY MODULE
// General helper functions for graph access, manipulation,
// debugging, and inspection
// ======================================================


// ======================================================
// GRAPH ACCESS HELPERS
// ======================================================

// Return all nodes
function showNodes() {
    const { nodes } = Graph.graphData();
    return nodes;
}


// Return all links
function showLinks() {
    const { links } = Graph.graphData();
    return links;
}


// Get node by ID
function nodeById(id) {

    var { nodes } = Graph.graphData();

    for (n of nodes) {
        if (n.id === id) return n;
    }
}


// Get multiple nodes by ID list
function nodesById(ids) {

    var { nodes } = Graph.graphData();
    var retNodes = [];

    for (n of nodes) {
        if (ids.indexOf(n.id !== -1)) retNodes.push(n); // original logic kept
    }

    return retNodes;
}


// ======================================================
// GRAPH MANIPULATION
// ======================================================

// Remove nodes (and optionally dependent children)
function removeNodes(ids) {

    var { nodes, links } = Graph.graphData();

    var removedNodes = [];

    // Identify nodes to remove
    nodes.forEach(n => {
        if (ids.indexOf(n.id) !== -1) removedNodes.push(n);
    });

    // Recursively remove dependent child nodes
    var removedChildren = [];

    removedNodes.forEach(n => {

        for (s of n.succ) {

            if (nodeById(s).pred.length === 1) {
                removedChildren.push(s);
            }
        }
    });

    if (removedChildren.length > 0) removeNodes(removedChildren);

    // Remove links connected to removed nodes
    links = links.filter(l =>
        removedNodes.indexOf(l.source) === -1 &&
        removedNodes.indexOf(l.target) === -1
    );

    // Remove nodes
    removedNodes.forEach(r => {
        nodes.splice(r.index, 1);
    });

    Graph.graphData({ nodes, links });
}


// Highlight single node
function colorNode(id) {

    var node = nodeByID(id); // original naming kept

    node.prevColorMode = node.colorMode;
    node.colorMode = "single";

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}


// Refresh graph rendering (forces redraw)
function refreshGraph() {

    const { nodes, links } = Graph.graphData();

    Graph
        .warmupTicks(0)
        .graphData({ nodes, links })
        .nodeThreeObject(node => nodeTHREESettings(node));
}


// ======================================================
// DEBUG / INSPECTION HELPERS
// ======================================================

// Log all node functions
function nodeFunctions() {

    const { nodes } = Graph.graphData();

    nodes.forEach(n => {
        console.log(n.function);
    });
}


// Log structure IDs of nodes
function showStructureIds() {

    const { nodes } = Graph.graphData();

    nodes.forEach(n => {
        console.log(n.structureID);
    });
}


// Log unique functions in graph
function showFunctions() {

    var found = [];
    var { nodes } = Graph.graphData();

    nodes.forEach(n => {

        if (found.indexOf(n.function) === -1) {

            found.push(n.function);
            console.log(n.function);
        }
    });
}


// Inspect function relationships of a node
function nodeFunctionInfo(index) {

    const { nodes } = Graph.graphData();

    var node = nodes[index];

    var pred = nodes.filter(n => node.pred.indexOf(n.index) !== -1);
    var succ = nodes.filter(n => node.succ.indexOf(n.index) !== -1);

    console.log("Vorgänger:");

    for (p of pred) {
        console.log(p.function);
    }

    console.log("Knoten:");
    console.log(node.function);

    console.log("Nachfolger:");

    for (s of succ) {
        console.log(s.function);
    }
}


// Show real predecessor/successor candidates
function showStructureCandidates() {

    const { nodes } = Graph.graphData();

    nodes.forEach(n => {

        if (n.realPred.length > 0) {
            console.log("Vorgänger:");
            console.log(n.realPred);
        }

        if (n.realSucc.length > 0) {
            console.log("Nachfolger:");
            console.log(n.realSucc);
        }
    });
}


// Return current library JSON
function showLibrary() {
    return Graph.appData.libraryJSON;
}


// ======================================================
// GENERIC HELPERS
// ======================================================

// Check if element exists in nested array
function exists(multiArray, search) {

    for (arr of multiArray) {
        if (multiArray.indexOf(search) !== -1) return true;
    }
}


// ======================================================
// INITIAL LOAD
// ======================================================

// Load default netlist on page load
window.addEventListener('load', function () {

    // 'RS232-T910_TjIn_uart.json'

    setTimeout(
        loadNetlist('data/designs/RS232-T910_TjIn_uart.json', true),
        1000
    );
});
```
---

## src/visuals.js

```javascript
// ======================================================
// VISUALIZATION MODULE
// Handles 3D rendering of nodes and links using THREE.js
// ======================================================


// ======================================================
// NODE RENDERING
// ======================================================

// Define 3D appearance of nodes based on type and state
function nodeTHREESettings(node) {

    // Determine color based on node state
    switch (node.colorMode) {

        case 'group':
            var clr = groupColors[node.group];
            break;

        case 'suspiciousnessHeat':
            var clr = d3.hsl(0, 1, node.suspiciousness, 1).formatHex();
            break;

        case 'structure':
            var clr = structureColors[node.structureID];
            break;

        case 'single':
            var clr = '#fcba03';
            break;

        case 'none':
        default:
            var clr = '#ffffff';
            break;
    }

    var id = node.id;

    // ---------------- Input Nodes ----------------
    if (id.startsWith("INPUT_")) {

        return new THREE.Mesh(
            new THREE.ConeGeometry(8, 16, Graph.nodeResolution),
            new THREE.MeshLambertMaterial({
                color: clr,
                transparent: true,
                opacity: 1
            })
        );

    // ---------------- Output Nodes ----------------
    } else if (id.startsWith("OUTPUT_")) {

        return new THREE.Mesh(
            new THREE.TorusGeometry(8, 3.2, Graph.nodeResolution, Graph.nodeResolution),
            new THREE.MeshLambertMaterial({
                color: clr,
                transparent: true,
                opacity: 1
            })
        );

    // ---------------- Default Nodes ----------------
    } else {

        return new THREE.Mesh(
            // new THREE.SphereGeometry(5, 32, 32),
            new THREE.TetrahedronGeometry(10, 0),
            new THREE.MeshLambertMaterial({
                color: clr,
                transparent: true,
                opacity: 1
            })
        );
    }
}


// ======================================================
// LINK RENDERING
// ======================================================

// Define link color based on structure or clustering
function linkColorSettings(link) {

    if (typeof link.colorID !== 'undefined') {

        if (link.colorMode === "group") {
            return groupColors[link.colorID];

        } else if (link.colorMode === "structure") {
            return structureColors[link.colorID];

        } else {
            return '#ffffff';
        }

    } else {
        return '#ffffff';
    }
}


// Define link width based on type
function linkWidthSettings(link) {

    if (typeof link.colorID !== 'undefined') {

        if (link.colorMode === "group") {
            return 2;

        } else if (link.colorMode === "structure") {
            return 4;

        } else {
            return 1;
        }

    } else {
        return 1;
    }
}


// Define curvature (used for self-loops)
function linkCurvatureSettings(link) {

    if (link.source === link.target) {
        return 0.5;
    } else {
        return 0;
    }
}


// ======================================================
// COLOR PALETTES
// ======================================================

// Colors for cluster/group visualization
const groupColors = [
    "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
    "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
    "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
    "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
    "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
    "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
    "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
    "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
    "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
    "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
    "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
    "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
    "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
    "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
    "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
    "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
    "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
    "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
    "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
    "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
    "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
    "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
    "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
    "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
    "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
    "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
    "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
    "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
    "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
    "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
    "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
    "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
    "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
    "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"
];


// Colors for structure highlighting (chains, loops, trees)
const structureColors = [
    "#ff6633", "#ffb399", "#ff33ff", "#ffff99", "#00b3e6", 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];


    



    
    
```
