// ======================================================
// INTERFACE MODULE
// Handles UI interaction, modals, and DOM utilities
// ======================================================

// ======================================================
// SIDEBAR
// ======================================================

// Toggle sidebar visibility
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Toggle submenu visibility
function toggleSubmenu(id) {
    document.getElementById(id).classList.toggle("active");
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
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

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

        modal.style.top = modal.offsetTop - pos2 + "px";
        modal.style.left = modal.offsetLeft - pos1 + "px";
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
    var modalMenu = document.getElementById(id + "Menu");

    modal.classList.add("fade");

    if (!modal.hasAttribute("draggable")) {
        makeModalDraggable(modal, modalMenu);
    }
}

// Close modal
function closeModal(id) {
    document.getElementById(id).classList.remove("fade");
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
    var warnings = document.getElementsByClassName("warning");

    for (warning of warnings) {
        warning.style.display = "none";
    }
}

// Hide all modal option sections
function clearModalOptions() {
    var options = document.getElementsByClassName("modalOption");

    for (op of options) {
        op.style.display = "none";
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

    var warningModal = document.getElementById("warningModal");
    var warningModalMenu = document.getElementById("warningModalMenu");

    clearPreviousWarnings();
    clearModalOptions();

    warningModal.classList.add("fade");

    document.getElementById(warningID).style.display = "inline-block";

    makeModalDraggable(warningModal, warningModalMenu);

    if (option !== null) {
        document.getElementById(option + "Next").style.display = "block";
    }
}

// ======================================================
// WINDOW EVENTS
// ======================================================

// Resize graph canvas with window
window.addEventListener(
    "resize",
    function () {
        Graph.width(window.innerWidth);
        Graph.height(window.innerHeight);
    },
    false,
);
