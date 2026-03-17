# Repository Context Part 1/5

Generated for LLM prompt context.

## css/style.css

```css
/* -------------------- Base Settings -------------------- */

* {
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

html {
    overflow: hidden;
}

a {
    text-decoration: none;
    color: black;
}

a:hover {
    color: gray;
}

/* -------------------- 3D Graph -------------------- */

.graph {
    position: absolute;
    display: block;
    top: 0px;
    right: 0px;
    z-index: 1;
}

/* -------------------- Sidebar -------------------- */

#sidebar {
    position: absolute;
    top: 0px;
    right: 5px;
    width: 350px;
    height: 100%;
    background: rgb(255, 255, 255);
    left: 0px;
    transition: .4s;
    z-index: 10;
}

#sidebar.active {
    left: -350px;
}

#sidebar_elements {
    height: 95%;
    overflow-y: auto;
    overflow-x: hidden;
    direction: rtl;
}

.sidebar_direction {
    direction: ltr;
}

#headingContainer {
    height: auto;
    position: relative;
    display: block;
    padding: 20px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #a5a5a5;
}

#sidebar > ul > li {
    list-style: none;
    color: rgb(0, 0, 0);
    font-size: 20px;
    padding: 10px 24px;
    border-bottom-style: solid;
    border-bottom-width: .1px;
    border-bottom-color: #e2e2e2;
}

#sidebar > ul > li:hover {
    background-color: #e2e2e2;
}

/* -------------------- Sidebar Submenus -------------------- */

.submenu > ul {
    display: none;
}

.submenu > ul > li {
    list-style: none;
    font-size: 18px;
    padding-top: 5px;
    padding-left: 15px;
    color: rgb(0, 0, 0);
    direction: ltr;
}

.submenu > ul.active {
    display: block;
}

.submenu > ul > li:hover {
    color: gray;
    cursor: pointer;
}

/* -------------------- Sidebar Toggle -------------------- */

#sidebar .toggle-btn {
    position: absolute;
    cursor: pointer;
    top: 30px;
    left: 370px;
}

.toggle-btn span {
    width: 45px;
    height: 4px;
    background: rgb(255, 255, 255);
    display: block;
    margin-top: 4px;
}

/* -------------------- Sidebar Elements -------------------- */

input[type=file] {
    display: none;
}

#fileLabel:hover {
    cursor: pointer;
}

/* -------------------- Modals -------------------- */

.modal {
    position: absolute;
    top: 50px;
    right: 50px;
    height: auto;
    padding-bottom: 40px;
    z-index: 30;
    display: block;
    visibility: hidden;
    width: max-content;
}

.modalMenu {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: #a5a5a5;
    height: 40px;
    z-index: 20;
    width: 100%;
    cursor: move;
    display: block;
}

.modalHeading {
    position: absolute;
    top: 8px;
    left: 10px;
}

.close {
    position: absolute;
    top: -10px;
    right: 5px;
    font-size: 40px;
    z-index: 20;
    cursor: pointer;
}

.modalContent {
    position: relative;
    background: rgb(201, 201, 201);
    top: 40px;
    width: max-content;
    padding: 30px;
    margin: 0px;
    z-index: 20;
}

.modal.fade {
    visibility: visible;
}

.modalCenter {
    display: block;
    text-align: center;
}

.modalLeft {
    display: block;
    text-align: left;
}

.modalRight {
    display: block;
    text-align: right;
}

.modalButtonBig {
    padding: 10px;
    margin: 3px;
}

/* -------------------- Modal States -------------------- */

.warning {
    display: none;
}

/* -------------------- Misc / Work in Progress -------------------- */

.slideContainer {
    position: relative;
}

#morphSlider {
    position: relative;
    z-index: 50;
}

.libraryNav {
    font-size: 26px;
    color: #6b6b6b;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
}

.libraryNav.active {
    color: black;
}

.libraryNav.active:hover {
    cursor: pointer;
    color: #3a3a3a;
}

.modalOption {
    display: none;
}

#fileInfo {
    font-size: 16px;
    margin-top: 10px;
}
```
---

## data/designs/RS232-T110_TjIn_baud.json

```json
{
    "directed": true,
    "multigraph": false,
    "graph": {},
    "nodes": [
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "OUTPUT_baud_clk"
        },
        {
            "partition": "top",
            "id": "INPUT_sys_clk"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_10"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_3"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_4"
        },
        {
            "partition": "top",
            "mcl": "i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_5"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "DFFSR_6"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "DFFSR_7"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_8"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "DFFSR_9"
        },
        {
            "partition": "top",
            "id": "INPUT_sys_rst_l"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "AOI21X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_3"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "AOI21X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_3"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NAND3X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "XOR2X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "XNOR2X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_5"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.32_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "OAI21X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NAND2X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NAND3X1_4"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NOR2X1_6"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NAND3X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "OAI21X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_10"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_8"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NAND3X1_3"
        },
        {
            "partition": "top",
            "mcl": "i_1.37_cluster_0, i_1.25_cluster_0, i_1.32_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NOR3X1_1"
        },
        {
            "partition": "top",
            "mcl": "i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "XNOR2X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_9"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "OAI21X1_3"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "INVX1_4"
        },
        {
            "partition": "top",
            "mcl": "i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_4"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "INVX1_6"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NOR2X1_7"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "INVX1_7"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.5_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "louvain": "run_0_cluster_4",
            "id": "NOR2X1_8"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NAND2X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.5_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_2"
        },
        {
            "partition": "top",
            "mcl": "i_1.3_cluster_0, i_1.37_cluster_0, i_1.25_cluster_0, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.4_cluster_0, i_1.35_cluster_0, i_1.32_cluster_0",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_11"
        },
        {
            "partition": "top",
            "mcl": "i_1.4_cluster_1, i_1.25_cluster_0, i_1.32_cluster_1, i_1.37_cluster_1, i_1.27_cluster_0, i_1.22_cluster_0, i_1.23_cluster_0, i_1.35_cluster_1, i_1.3_cluster_1",
            "nsbm": "run_0_cluster_0, run_0_cluster_1",
            "id": "NOR2X1_5"
        }
    ],
    "links": [
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_1"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_10"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_2"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_3"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_4"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_5"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_6"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_7"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_8"
        },
        {
            "source": "INPUT_sys_clk",
            "target": "DFFSR_9"
        },
        {
            "source": "DFFSR_1",
            "target": "AOI21X1_1"
        },
        {
            "source": "DFFSR_1",
            "target": "INVX1_3"
        },
        {
            "source": "DFFSR_1",
            "target": "NAND3X1_1"
        },
        {
            "source": "DFFSR_1",
            "target": "XOR2X1_1"
        },
        {
            "source": "DFFSR_10",
            "target": "OUTPUT_baud_clk"
        },
        {
            "source": "DFFSR_10",
            "target": "XNOR2X1_1"
        },
        {
            "source": "DFFSR_2",
            "target": "AOI21X1_1"
        },
        {
            "source": "DFFSR_2",
            "target": "NAND3X1_1"
        },
        {
            "source": "DFFSR_2",
            "target": "XOR2X1_1"
        },
        {
            "source": "DFFSR_3",
            "target": "AOI21X1_1"
        },
        {
            "source": "DFFSR_3",
            "target": "NAND3X1_1"
        },
        {
            "source": "DFFSR_4",
            "target": "INVX1_5"
        },
        {
            "source": "DFFSR_4",
            "target": "NOR2X1_1"
        },
        {
            "source": "DFFSR_4",
            "target": "OAI21X1_1"
        },
        {
            "source": "DFFSR_5",
            "target": "INVX1_1"
        },
        {
            "source": "DFFSR_6",
            "target": "NAND2X1_1"
        },
        {
            "source": "DFFSR_6",
            "target": "NAND3X1_4"
        },
        {
            "source": "DFFSR_6",
            "target": "NOR2X1_1"
        },
        {
            "source": "DFFSR_6",
            "target": "NOR2X1_6"
        },
        {
            "source": "DFFSR_7",
            "target": "NAND3X1_2"
        },
        {
            "source": "DFFSR_7",
            "target": "NAND3X1_4"
        },
        {
            "source": "DFFSR_7",
            "target": "OAI21X1_2"
        },
        {
            "source": "DFFSR_8",
            "target": "INVX1_2"
        },
        {
            "source": "DFFSR_8",
            "target": "NOR2X1_10"
        },
        {
            "source": "DFFSR_9",
            "target": "AOI21X1_2"
        },
        {
            "source": "DFFSR_9",
            "target": "INVX1_8"
        },
        {
            "source": "DFFSR_9",
            "target": "NAND3X1_3"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_1"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_10"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_2"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_3"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_4"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_5"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_6"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_7"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_8"
        },
        {
            "source": "INPUT_sys_rst_l",
            "target": "DFFSR_9"
        },
        {
            "source": "AOI21X1_1",
            "target": "NOR2X1_3"
        },
        {
            "source": "NOR2X1_3",
            "target": "DFFSR_3"
        },
        {
            "source": "AOI21X1_2",
            "target": "DFFSR_9"
        },
        {
            "source": "INVX1_3",
            "target": "DFFSR_1"
        },
        {
            "source": "NAND3X1_1",
            "target": "INVX1_4"
        },
        {
            "source": "NAND3X1_1",
            "target": "NOR2X1_2"
        },
        {
            "source": "NAND3X1_1",
            "target": "NOR2X1_4"
        },
        {
            "source": "NAND3X1_1",
            "target": "NOR3X1_1"
        },
        {
            "source": "XOR2X1_1",
            "target": "DFFSR_2"
        },
        {
            "source": "XNOR2X1_1",
            "target": "DFFSR_10"
        },
        {
            "source": "INVX1_5",
            "target": "NOR2X1_4"
        },
        {
            "source": "INVX1_5",
            "target": "NOR3X1_1"
        },
        {
            "source": "NOR2X1_1",
            "target": "NAND3X1_2"
        },
        {
            "source": "OAI21X1_1",
            "target": "NOR2X1_5"
        },
        {
            "source": "INVX1_1",
            "target": "NAND3X1_3"
        },
        {
            "source": "INVX1_1",
            "target": "NOR3X1_1"
        },
        {
            "source": "INVX1_1",
            "target": "XNOR2X1_2"
        },
        {
            "source": "NAND2X1_1",
            "target": "INVX1_6"
        },
        {
            "source": "NAND3X1_4",
            "target": "INVX1_7"
        },
        {
            "source": "NAND3X1_4",
            "target": "NOR2X1_9"
        },
        {
            "source": "NAND3X1_4",
            "target": "OAI21X1_3"
        },
        {
            "source": "NOR2X1_6",
            "target": "NOR2X1_7"
        },
        {
            "source": "NAND3X1_2",
            "target": "NOR2X1_2"
        },
        {
            "source": "OAI21X1_2",
            "target": "NOR2X1_8"
        },
        {
            "source": "INVX1_2",
            "target": "NAND3X1_2"
        },
        {
            "source": "INVX1_2",
            "target": "NOR2X1_9"
        },
        {
            "source": "INVX1_2",
            "target": "OAI21X1_3"
        },
        {
            "source": "NOR2X1_10",
            "target": "NOR2X1_11"
        },
        {
            "source": "INVX1_8",
            "target": "OAI21X1_3"
        },
        {
            "source": "NAND3X1_3",
            "target": "NAND2X1_2"
        },
        {
            "source": "NAND3X1_3",
            "target": "OAI21X1_1"
        },
        {
            "source": "NAND3X1_3",
            "target": "OAI21X1_2"
        },
        {
            "source": "NAND3X1_3",
            "target": "XNOR2X1_1"
        },
        {
            "source": "NOR3X1_1",
            "target": "NAND2X1_1"
        },
        {
            "source": "NOR3X1_1",
            "target": "NAND3X1_4"
        },
        {
            "source": "NOR3X1_1",
            "target": "NOR2X1_6"
        },
        {
            "source": "XNOR2X1_2",
            "target": "DFFSR_5"
        },
        {
            "source": "NOR2X1_9",
            "target": "AOI21X1_2"
        },
        {
            "source": "NOR2X1_9",
            "target": "NOR2X1_11"
        },
        {
            "source": "OAI21X1_3",
            "target": "NAND2X1_2"
        },
        {
            "source": "INVX1_4",
            "target": "NOR2X1_3"
        },
        {
            "source": "INVX1_4",
            "target": "OAI21X1_1"
        },
        {
            "source": "NOR2X1_4",
            "target": "NOR2X1_5"
        },
        {
            "source": "NOR2X1_4",
            "target": "XNOR2X1_2"
        },
        {
            "source": "INVX1_6",
            "target": "NOR2X1_7"
        },
        {
            "source": "INVX1_6",
            "target": "OAI21X1_2"
        },
        {
            "source": "NOR2X1_7",
            "target": "DFFSR_6"
        },
        {
            "source": "INVX1_7",
            "target": "NOR2X1_10"
        },
        {
            "source": "INVX1_7",
            "target": "NOR2X1_8"
        },
        {
            "source": "NOR2X1_8",
            "target": "DFFSR_7"
        },
        {
            "source": "NAND2X1_2",
            "target": "AOI21X1_2"
        },
        {
            "source": "NOR2X1_2",
            "target": "NAND3X1_3"
        },
        {
            "source": "NOR2X1_11",
            "target": "DFFSR_8"
        },
        {
            "source": "NOR2X1_5",
            "target": "DFFSR_4"
        }
    ]
}
```
