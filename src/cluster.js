// ======================================================
// CLUSTER / PARTITION / SUSPICIOUSNESS UI
// ======================================================

// Open clustering modal if a netlist is loaded
function openClusterModal() {
  if (netlistExists()) {
    openModal("clusterModal");
    toggleClusterParams();
  } else {
    showWarning("missingNetlistWarning");
  }
}

// Show only the parameter box for the currently selected clustering mode
function toggleClusterParams() {
  var algorithmSelect = document.getElementById("clusteringSelect");
  var selectedAlgorithm = algorithmSelect.value;
  var selectedBox = document.getElementById(selectedAlgorithm + "Params");
  var paramBoxes = document.getElementsByClassName("clusterparams");

  for (box of paramBoxes) {
    if (box === selectedBox) {
      box.style.display = "block";
    } else {
      box.style.display = "none";
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
}

function applyMCL() {
  var iterationSelect = document.getElementById("mclIterationSelect");
  var iteration = iterationSelect.value;

  setMCLCluster(iteration);
}

function applyPartition() {
  var partitionSelect = document.getElementById("partitionSelect");
  var partition = partitionSelect.value;

  setPartition(partition);
}

function applyNSBM() {
  var runSelect = document.getElementById("nsbmRunSelect");
  var entrySelect = document.getElementById("nsbmEntrySelect");

  setRegularCluster("nsbm", runSelect.value, entrySelect.value - 1);
}

function applyLeiden() {
  var runSelect = document.getElementById("leiden_modRunSelect");
  var entrySelect = document.getElementById("leiden_modEntrySelect");

  setRegularCluster("leiden_mod", runSelect.value, entrySelect.value - 1);
}

function applySuspiciousness() {
  var suspiciousnessSelect = document.getElementById("suspiciousnessSelect");
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

  nodes.forEach((n) => {
    if (typeof n[method] !== "undefined") {
      var clusterData = n.clusterData[method];
      var entries = clusterData[run];

      if (entryIndex > entries.length) {
        n.group = -1;
        n.colorMode = "none";
      } else {
        n.group = entries[entryIndex];
        n.colorMode = "group";
        n.prevColorMode = "group";
      }
    } else {
      n.group = -1;
      n.colorMode = "none";
    }
  });

  assignLinkColors();
  readGroups();
  resetGroupDistances();
  removeClusterDistanceOptions();
  setClusterDistanceOptions();

  if (Graph.appData.groups.length > 0) {
    Graph.appData.selectedGroup = Graph.appData.groups[0];
  }

  Graph.appData.toolMode = "cluster";

  Graph.refresh().numDimensions(Graph.appData.dimensions);
}

// Apply MCL cluster assignment based on selected inflation / iteration value
function setMCLCluster(iteration) {
  var { nodes, links } = Graph.graphData();

  nodes.forEach((n) => {
    if (typeof n.mcl !== "undefined") {
      var parsed = n.mcl.split(", ");

      if (
        typeof parsed.find((el) => el.includes(iteration.toString())) !==
        "undefined"
      ) {
        var str = parsed.find((el) => el.includes(iteration.toString()));
        var clusterNumber = parseInt(str.split("_")[3]);

        n.group = clusterNumber;
        n.colorMode = "group";
        n.prevColorMode = "group";
      } else {
        n.group = -1;
        n.colorMode = "none";
      }
    } else {
      n.group = -1;
      n.colorMode = "none";
    }
  });

  assignLinkColors();
  readGroups();
  resetGroupDistances();
  removeClusterDistanceOptions();
  setClusterDistanceOptions();

  if (Graph.appData.groups.length > 0) {
    Graph.appData.selectedGroup = Graph.appData.groups[0];
  }

  Graph.appData.toolMode = "cluster";

  Graph.refresh().numDimensions(Graph.appData.dimensions);
}

// Highlight all nodes belonging to a selected partition
function setPartition(part) {
  const { nodes, links } = Graph.graphData();

  nodes.forEach((n) => {
    if (typeof n.partition !== "undefined") {
      if (n.partition.includes(part)) {
        n.group = 0;
        n.colorMode = "group";
        n.prevColorMode = "group";
      } else {
        n.group = -1;
        n.colorMode = "none";
      }
    } else {
      n.group = -1;
      n.colorMode = "none";
    }
  });

  assignLinkColors();
  readGroups();
  resetGroupDistances();
  removeClusterDistanceOptions();
  setClusterDistanceOptions();

  if (Graph.appData.groups.length > 0) {
    Graph.appData.selectedGroup = Graph.appData.groups[0];
  }

  Graph.appData.toolMode = "cluster";

  Graph.refresh().numDimensions(Graph.appData.dimensions);
}

// Apply suspiciousness heatmap coloring
function setSuspiciousnessHeat(selected) {
  const { nodes, links } = Graph.graphData();

  switch (selected) {
    case "Minimum":
      var mode = "susp_min";
      break;

    case "Mean":
      var mode = "susp_mean";
      break;

    case "Maximum":
      var mode = "susp_max";
      break;

    default:
      var mode = "susp_max";
      break;
  }

  nodes.forEach((n) => {
    if (typeof n[mode] !== "undefined") {
      if (typeof n[mode] !== "number") {
        n.suspiciousness = parseFloat(n[mode]);
      } else {
        n.suspiciousness = n[mode];
      }

      n.colorMode = "suspiciousnessHeat";
    } else {
      n.colorMode = "none";
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

  nodes.forEach((n) => {
    if (typeof n[method] !== "undefined") {
      var parsed = n[method].split(", ");
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

  nodes.forEach((n) => {
    if (typeof n.mcl !== "undefined") {
      var parsed = n.mcl.split(", ");

      for (let i = 0; i < parsed.length; i++) {
        var str = parsed[i];
        var iteration = parseFloat(str.split("_")[1]);

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

  nodes.forEach((n) => {
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

  nodes.forEach((n) => {
    if (
      typeof n.susp_min !== "undefined" &&
      options.indexOf("Minimum") === -1
    ) {
      options.push("Minimum");
    }

    if (typeof n.susp_mean !== "undefined" && options.indexOf("Mean") === -1) {
      options.push("Mean");
    }

    if (
      typeof n.susp_max !== "undefined" &&
      options.indexOf("Maximum") === -1
    ) {
      options.push("Maximum");
    }
  });

  return options;
}

// Collect currently active group ids from the graph
function readGroups() {
  var { nodes, links } = Graph.graphData();
  var groups = [];

  nodes.forEach((n) => {
    if (groups.indexOf(n.group) === -1 && n.group !== -1) {
      groups.push(n.group);
    }
  });

  Graph.appData.groups = groups;
}
