// ======================================================
// LIBRARY MODULE
// Handles gate library import, editing, navigation, and sample libraries
// ======================================================

// ======================================================
// FILE INPUT (LIBRARY IMPORT)
// ======================================================

document.getElementById("libraryFile").addEventListener(
    "change",
    function (e) {
        e = e || window.event;
        readLibraryFile(e);
    },
    false,
);

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
        showWarning("missingLibraryWarning");
    } else {
        try {
            addSelectOptions("addCellType", window.Graph.appData.libraryTypes);
            addSelectOptions(
                "addCellFunction",
                window.Graph.appData.libraryFunctions,
            );

            openModal("importEntryModal");
        } catch (e) {
            showWarning("importWarning");
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
    addSelectOptions("addCellFunction", [functionInput.value]);

    toggleFunctionOption();
}

// Add new gate type to library
function addCellType() {
    var cellInput = document.getElementById("newType");

    Graph.appData.libraryTypes.push(cellInput.value);
    addSelectOptions("addCellType", [cellInput.value]);

    toggleTypeOption();
}

// Remove currently selected gate function
function removeCellFunction() {
    var functionSelect = document.getElementById("addCellFunction");
    var index = Graph.appData.libraryJSON.functions.indexOf(
        functionSelect.value,
    );

    (Graph.appData.libraryJSON.functions.splice(index, 1),
        addSelectOptions(
            "addCellFunction",
            window.Graph.appData.libraryFunctions,
        ));
}

// Remove currently selected gate type
function removeCellType() {
    var functionSelect = document.getElementById("addCellType");
    var index = Graph.appData.libraryTypes.indexOf(functionSelect.value);

    (Graph.appData.libraryTypes.splice(index, 1),
        addSelectOptions("addCellType", window.Graph.appData.libraryTypes));
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
        openModal("newLibraryModal");
    } else {
        showWarning("existingLibraryWarning", "newLibrary");
    }
}

// Create library object from input field
function createNewLibrary() {
    var nameInput = document.getElementById("newLibraryName");
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
    if (
        Graph.appData.libraryCellCounter <
        Graph.appData.libraryJSON.cells.length
    ) {
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
    openModal("showLibraryModal");

    refreshCellCount();
    refreshCellNavigation();
    showLibraryCell(Graph.appData.libraryCellCounter);
}

// Update previous / next navigation state
function refreshCellNavigation() {
    var nextButton = document.getElementById("nextCell");
    var prevButton = document.getElementById("prevCell");

    if (
        Graph.appData.libraryCellCounter <
        Graph.appData.libraryJSON.cells.length
    ) {
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
    Graph.appData.libraryJSON.cells.splice(
        Graph.appData.libraryCellCounter - 1,
        1,
    );

    if (
        Graph.appData.libraryCellCounter ===
        Graph.appData.libraryJSON.cells.length
    ) {
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

    nodes.forEach((n) => {
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

    list.innerHTML = "<li>" + missing.join("</li><li>") + "</li>";
}
