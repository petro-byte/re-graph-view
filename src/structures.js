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
        addSelectOptions(
            "chainGateSelect",
            Graph.appData.libraryJSON.functions,
        );
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
    var identicalLoopNodeFunctions = document.getElementById(
        "identicalLoopNodeFunctions",
    ).checked;

    switch (selected) {
        case "chain":
            setChainStructures(minLength, maxLength, chainGateFunction);
            break;

        case "tree":
            setTreeStructures(
                minLength,
                maxLength,
                minChildren,
                singleFanIn,
                inverseTree,
            );
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
function setChainStructures(
    minLength,
    maxLength,
    gateFunction,
    markInBetweenLinks,
) {
    minLength = minLength ? minLength : 3;
    maxLength = maxLength ? maxLength : 20;
    gateFunction = gateFunction ? gateFunction : "all";
    markInBetweenLinks = markInBetweenLinks ? markInBetweenLinks : true;

    var { nodes, links } = Graph.graphData();

    var firstNodes = findChainStartCandidates(markInBetweenLinks);
    var chains = [];

    var structureID = 0;

    Graph.appData.lookAtNodes = [];

    firstNodes.forEach((node) => {
        var chain = [node];
        var currentNode = node;
        var pushChain = true;

        // Traverse forward while chain continues
        while (currentNode.realSucc.length === 1) {
            currentNode = nodeById(currentNode.realSucc[0]);

            if (
                gateFunction === currentNode.function ||
                gateFunction === "all"
            ) {
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
            chain.forEach((n) => {
                node.prevColorMode = node.colorMode;
                n.colorMode = "structure";
                n.structureID = structureID;
            });

            if (markInBetweenLinks) {
                links.forEach((l) => {
                    if (
                        chain.indexOf(l.source) !== -1 &&
                        chain.indexOf(l.target) !== -1
                    ) {
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

    nodes.forEach((n) =>
        checkChainStartCandidate(n, candidates, markInBetweenLinks),
    );

    return candidates;
}

// Check if node qualifies as chain start
function checkChainStartCandidate(node, candidates, markInBetweenLinks) {
    if (
        node.function !== "unknown" &&
        node.realPred.length === 0 &&
        (node.realSucc.length === 1 ||
            (node.realSucc.length > 1 && markInBetweenLinks))
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
    identicalLoopNodeFunctions = identicalLoopNodeFunctions
        ? identicalLoopNodeFunctions
        : false;

    var candidates = findLoopNodeCandidates();
    var loops = [];
    var idCounter = 0;

    while (candidates.length > 0) {
        var baseNode = candidates.pop();
        var nextNode = baseNode.next;

        var loop = [baseNode, nextNode];

        candidates = candidates.filter((n) => n !== nextNode);

        while (nextNode !== baseNode && typeof nextNode.next !== "undefined") {
            nextNode = nextNode.next;
            candidates = candidates.filter((n) => n !== nextNode);

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
            node.function !== "unknown" &&
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
function setTreeStructures(
    minLength,
    maxLength,
    minChildren,
    singleFanIn,
    inverseTree,
) {
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
                        var fanInCheck = singleFanIn
                            ? n.pred.length === 1
                            : true;

                        if (succNode.function === childFunction && fanInCheck) {
                            nextLayer.push(succNode);
                        }
                    }
                }

                if (n.realPred.length >= minChildren && inverseTree) {
                    for (p of n.pred) {
                        var predNode = nodeById(p);
                        var fanInCheck = singleFanIn
                            ? n.succ.length === 1
                            : true;

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
                    if (
                        typeof functionCounts[neighborNode.function] ===
                        "undefined"
                    ) {
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
                    root: node,
                    childFunction: treeChildFunction,
                });
            }
        }
    }

    return candidates;
}
