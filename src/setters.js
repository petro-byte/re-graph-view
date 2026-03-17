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

    nodes.forEach((n) => {
        n.colorMode = n.prevColorMode;
        n.structureID = -1;
    });

    links.forEach((l) => {
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

    links.forEach((l) => {
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
            l.target.colorMode === "group" &&
            l.source.colorMode === "group"
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
    var clusterSliderContainer = document.getElementById(
        "clusterSliderContainer",
    );

    // Reset link force distances
    Graph.d3Force("link").distance((l) => {
        return Graph.appData.groupDistances.default;
    });

    // Reset stored distances per group
    for (group of Graph.appData.groups) {
        Graph.appData.groupDistances[group] =
            Graph.appData.groupDistances.default;
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

    nodes.forEach((n) => {
        n.group = -1;
        n.colorMode = "none";
        n.prevColorMode = "none";
    });

    links.forEach((l) => {
        l.colorID = -1;
        l.colorMode = "none";
    });

    resetGroupDistances();

    Graph.graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}

// ======================================================
// LAYOUT / STRUCTURE RESET HELPERS
// ======================================================

// Reset cluster split layout
function resetSplit() {
    var { nodes, links } = Object.assign({}, Graph.appData.netlistJSON);

    Graph.graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}

// Reset structure visualization
function resetStructure() {
    var { nodes, links } = Object.assign({}, Graph.appData.netlistJSON);

    Graph.graphData({ nodes, links })
        .refresh()
        .numDimensions(Graph.appData.dimensions);
}
