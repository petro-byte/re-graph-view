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
        if (ids.indexOf(n.id) !== -1) retNodes.push(n); // original logic kept
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
    nodes.forEach((n) => {
        if (ids.indexOf(n.id) !== -1) removedNodes.push(n);
    });

    // Recursively remove dependent child nodes
    var removedChildren = [];

    removedNodes.forEach((n) => {
        for (s of n.succ) {
            if (nodeById(s).pred.length === 1) {
                removedChildren.push(s);
            }
        }
    });

    if (removedChildren.length > 0) removeNodes(removedChildren);

    // Remove links connected to removed nodes
    links = links.filter(
        (l) =>
            removedNodes.indexOf(l.source) === -1 &&
            removedNodes.indexOf(l.target) === -1,
    );

    // Remove nodes
    removedNodes.forEach((r) => {
        nodes.splice(r.index, 1);
    });

    Graph.graphData({ nodes, links });
}

// Highlight single node
function colorNode(id) {
    var node = nodeById(id);

    node.prevColorMode = node.colorMode;
    node.colorMode = "single";

    Graph.refresh().numDimensions(Graph.appData.dimensions);
}

// Refresh graph rendering (forces redraw)
function refreshGraph() {
    const { nodes, links } = Graph.graphData();

    Graph.warmupTicks(0)
        .graphData({ nodes, links })
        .nodeThreeObject((node) => nodeTHREESettings(node));
}

// ======================================================
// DEBUG / INSPECTION HELPERS
// ======================================================

// Log all node functions
function nodeFunctions() {
    const { nodes } = Graph.graphData();

    nodes.forEach((n) => {
        console.log(n.function);
    });
}

// Log structure IDs of nodes
function showStructureIds() {
    const { nodes } = Graph.graphData();

    nodes.forEach((n) => {
        console.log(n.structureID);
    });
}

// Log unique functions in graph
function showFunctions() {
    var found = [];
    var { nodes } = Graph.graphData();

    nodes.forEach((n) => {
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

    var pred = nodes.filter((n) => node.pred.indexOf(n.index) !== -1);
    var succ = nodes.filter((n) => node.succ.indexOf(n.index) !== -1);

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

    nodes.forEach((n) => {
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
window.addEventListener("load", function () {
    loadNetlist("data/designs/RS232-T910_TjIn_uart.json", true);
});
