// ======================================================
// SAMPLE MODULE
// Handles loading of sample netlists and sample libraries
// ======================================================

// ======================================================
// CONFIGURATION
// Set these paths to your actual external sample library files
// ======================================================

const SAMPLE_LIBRARY_EXTENDED_PATH = "data/libraries/osu035_extended.json";
const SAMPLE_LIBRARY_EXTENDED_FILE_NAME = "osu035_extended.json";

// ======================================================
// UI ENTRY
// ======================================================

// Load selected sample netlist and optionally the sample library
function selectSample() {
    var sampleSelect = document.getElementById("sampleSelect");
    var libraryCheckbox = document.getElementById("sampleLibraryCheckbox");

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
            SAMPLE_LIBRARY_EXTENDED_FILE_NAME,
        );

        closeModal("importEntryModal");
        closeModal("showLibraryModal");
        closeModal("newLibraryModal");

        applyLibrary();
    } catch (error) {
        console.error("Failed to load sample library:", error);
        showWarning("importWarning");
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
                SAMPLE_LIBRARY_EXTENDED_FILE_NAME,
            );
        }

        const response = await fetch("data/designs/" + sample);

        if (!response.ok) {
            throw new Error(`Failed to load sample netlist: ${sample}`);
        }

        const json = await response.json();

        Graph.appData.netlistJSON = json;
        Graph.appData.netlistFile = sample;

        forceGraphSettings(json);
        Graph.appData.dataSet = false;
    } catch (error) {
        console.error("Failed to load sample:", error);
        showWarning("importWarning");
    }
}

// Load netlist from arbitrary path
async function loadNetlist(sample, readSampleLibrary) {
    try {
        if (readSampleLibrary) {
            await loadExternalLibrary(
                SAMPLE_LIBRARY_EXTENDED_PATH,
                SAMPLE_LIBRARY_EXTENDED_FILE_NAME,
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
        console.error("Failed to load netlist:", error);
        showWarning("importWarning");
    }
}
