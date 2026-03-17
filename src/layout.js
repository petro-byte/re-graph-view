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
    links = links.filter((l) => l.group !== -2);

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
    Graph.d3Force("link").distance((l) => {
        // Selected group → apply custom distance
        if (l.group === group) {
            Graph.appData.groupDistances[group] = distance;
            return distance;

            // Other known groups → use stored values
        } else if (Graph.appData.groups.indexOf(l.group) !== -1) {
            if (typeof Graph.appData.groupDistances[l.group] === "undefined") {
                Graph.appData.groupDistances[l.group] =
                    Graph.appData.groupDistances.default;
            }

            return Graph.appData.groupDistances[l.group];

            // Default fallback
        } else {
            return Graph.appData.groupDistances.default;
        }
    });

    Graph.numDimensions(Graph.appData.dimensions);
}
