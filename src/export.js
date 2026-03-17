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

    var data = { Graph: Graph };
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
    var dataURI =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    var exportFileDefaultName = fileName;

    var linkElement = document.createElement("a");

    linkElement.setAttribute("href", dataURI);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
}

// ======================================================
// EXPORT FORMATS
// ======================================================

// Reconstruct a reduced netlist export that preserves only
// the original netlist-relevant node and link properties
function netlistData() {
    var data = {
        directed: true,
        multigraph: false,
        graph: {},
        nodes: [],
        links: [],
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
        "id",
    ];

    const originalLinkProperties = ["source", "target"];

    nodes.forEach((n) => {
        for (key of Object.keys(n)) {
            if (originalNodeProperties.indexOf(key) === -1) {
                delete n[key];
            }
        }

        data.nodes.push(n);
    });

    links.forEach((l) => {
        for (key of Object.keys(l)) {
            if (originalLinkProperties.indexOf(key) === -1) {
                delete l[key];
            }
        }

        data.links.push(l);
    });

    return data;
}
