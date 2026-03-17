// ======================================================
// CAMERA MODULE
// Handles camera interaction, views, and animation control
// ======================================================

// ======================================================
// UI TRIGGERS (called from sidebar)
// ======================================================

// Reset camera to initial position
function resetCameraView() {
    resetCamera();
}

// Toggle physics cooldown (freeze / unfreeze layout)
function toggleCameraFreeze() {
    toggleSubmenuLabel("cameraMenuFreeze", "Freeze", "Unfreeze");
    cooldownToggle();
}

// Toggle animation (pause / resume force simulation)
function toggleCameraAnimation() {
    toggleSubmenuLabel("cameraMenuStop", "Stop", "Restart");
    animationToggle();
}

// Open camera views modal
function openCameraViews() {
    openModal("cameraViewsModal");
}

// Open dimension selection modal
function openDimensionSettings() {
    openModal("graphDimensionsModal");
}

// ======================================================
// CAMERA SETTINGS
// ======================================================

// Change number of dimensions (2D / 3D)
function changeDimensions() {
    var dimensionSelect = document.getElementById("dimensionSelect");
    var dim = parseInt(dimensionSelect.value);

    Graph.appData.dimensions = dim;

    Graph.refresh().numDimensions(dim);
}

// ======================================================
// CAMERA VIEWS (SAVE / LOAD / DELETE)
// ======================================================

// Apply selected camera view
function changeView() {
    var viewSelect = document.getElementById("viewSelect");
    var selected = viewSelect.value;

    var view = Graph.appData.cameraViews[selected];

    Graph.cameraPosition(
        { x: view.x, y: view.y, z: view.z },
        view.lookAt,
        1000,
    );

    // Redundant but kept intentionally (original behavior)
    Graph.cameraPosition(view);
}

// Delete stored camera view
function deleteView() {
    var viewSelect = document.getElementById("viewSelect");
    var selected = viewSelect.value;

    if (selected !== "Initial") {
        delete Graph.appData.cameraViews[selected];
        removeSelectOption("viewSelect", selected);
        viewSelect.selectedIndex = 0;
    }
}

// Add new camera view based on current position
function addView() {
    var nameInput = document.getElementById("newViewName");
    var viewName = nameInput.value;

    var view = Graph.cameraPosition();

    Graph.appData.cameraViews[viewName] = view;
    addSelectOptions("viewSelect", [viewName]);

    nameInput.value = "";
}

// ======================================================
// CAMERA POSITIONING
// ======================================================

// Reset camera to initial state
function resetCamera() {
    var initialPosition = Graph.appData.initialCameraPosition;

    Graph.cameraPosition(
        {
            x: initialPosition.x,
            y: initialPosition.y,
            z: initialPosition.z,
        },
        initialPosition.lookAt,
        1000,
    );
}

// Focus camera on a specific node
// Used for interactive inspection of graph elements
function focusOnNode(node) {
    const distance = 400;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    Graph.cameraPosition(
        {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
        },
        node,
        1000,
    );

    nodeZoom = true;
}

// Store camera position with a marker reference
function addCameraPoint(marker) {
    var camPoint = Graph.cameraPosition();
    Graph.appData.cameraPoints.push({ marker, camPoint });
}

// Save initial camera position (used for reset)
function setInitialCameraPosition() {
    Graph.appData.initialCameraPosition = Graph.cameraPosition();
}

// ======================================================
// GRAPH SIMULATION CONTROL
// ======================================================

// Toggle force simulation cooldown
// -> Freezes / unfreezes graph layout
function cooldownToggle() {
    if (!Graph.appData.isCooled) {
        Graph.cooldownTime(1);
        Graph.appData.isCooled = true;
    } else {
        Graph.warmupTicks(0).cooldownTime(30000);

        Graph.refresh().numDimensions(Graph.appData.dimensions);

        Graph.appData.isCooled = false;
    }
}

// Toggle animation state (pause / resume)
function animationToggle() {
    Graph.appData.isAnimationActive
        ? Graph.pauseAnimation()
        : Graph.resumeAnimation();

    Graph.appData.isAnimationActive = !Graph.appData.isAnimationActive;
}
