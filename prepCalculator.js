// ==========================================
// PREP CALCULATOR
// ==========================================

import {
    findProducts,
    findNewProducts
} from "./productParser.js";

import {
    breadRecipes
} from "./breadOrder.js";


// ==========================================
// PREP PDF ELEMENTS
// ==========================================

const prepPdfFile =
    document.getElementById(
        "prepPdfFile"
    );

const prepStatus =
    document.getElementById(
        "prepStatus"
    );

const prepCategories =
    document.getElementById(
        "prepCategories"
    );


// ==========================================
// SALAD TYPES
// ==========================================

const saladProductTypes = {

    // ======================================
    // LARGE SALADS
    // ======================================

    "Pork Taco (LG)": {},

    "Sweet Potato and Chicken Green Salad (LG)": {},

    "Blueberry and Strawberry (LG)": {},

    "Harvest (LG)": {},

    "Large Cobb": {},

    "Large Chef Bowl": {},

    "Large Garden": {},

    "Large Spinach Chicken": {},

    "Mediterranean (LG)": {},


    // ======================================
    // SMALL SALADS
    // ======================================

    "Small Chef Bowl MWF": {},

    "Small Garden": {},

    "Small Spinach Chicken": {}
};


// ==========================================
// COMPOUND TYPES
// ==========================================

const compoundProductTypes = {

    // ======================================
    // 8 OZ / SALAD COMPOUNDS
    // ======================================

    "8oz Orange Peach": {},

    "8oz Potato W/ Egg": {},

    "8oz Seafood Pasta": {},

    "8oz Strawberry": {},


    // ======================================
    // COMPOUNDS
    // ======================================

    "Broccoli/Kale Slaw": {},

    "Deli Pasta": {},

    "Macaroni Shell 8oz": {},

    "Pico De Gallo": {},

    "Baked Potato": {},

    "Caprese Bowtie": {},

    "Broccoli/Slaw Craisin 8oz": {},

    "Edamame Bean Sweet and Spicy": {},

    "Macaroni Shell": {},

    "Orange Peach": {},

    "Potato with Egg": {},

    "Seafood Pasta": {},

    "Pico De Gallo 16 oz": {},


    // ======================================
    // LARGE TAKEOUT COMPOUNDS
    // ======================================

    "Deli Pasta 7.5 lb Bowl Take Out": {},

    "Broccoli/Kale Slaw 5 lb Bowl Take Out": {},


    // ======================================
    // SMALL STRAWBERRY SALAD
    // ======================================

    "Strawberry Salad (S)": {},


    // ======================================
    // OTHER COMPOUNDS
    // ======================================

    "Charcuterie Cup w/ Hummus": {},

    "Relish Tray Medium Takeout": {},

    "Berry w/ Granola 12 oz Package": {},

    "Bean Dip": {},

    "Charcuterie Box": {},

    "Hummus in a Cambro": {},


    // ======================================
    // FUTURE COMPOUNDS
    // ======================================

    "Honey Butter": {
        future: true
    },

    "Wild Berry Cream Cheese": {
        future: true
    },

    "Plain Cream Cheese": {
        future: true
    },

    "Onion and Chives Cream Cheese": {
        future: true
    },

    "Strawberry Cream Cheese": {
        future: true
    },

    "Honey Nut Cream Cheese": {
        future: true
    }
};


// ==========================================
// ALL KNOWN PREP PRODUCTS
// ==========================================

const allKnownPrepProducts = {

    ...breadRecipes,

    ...saladProductTypes,

    ...compoundProductTypes
};


// ==========================================
// DISPLAY PRODUCT TYPES
// ==========================================

function displayProductTypes(
    containerId,
    orders,
    emptyMessage
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    let html = "";


    // ------------------------------------------
    // Display each product
    // ------------------------------------------

    for (
        const product in orders
    ) {

        html += `
            <div class="prep-row">

                <span class="prep-name">
                    ${product}
                </span>

                <span class="prep-quantity">
                    ${orders[product]}
                </span>

            </div>
        `;
    }


    // ------------------------------------------
    // Nothing found
    // ------------------------------------------

    if (!html) {

        html = `
            <p>
                ${emptyMessage}
            </p>
        `;
    }


    container.innerHTML =
        html;
}


// ==========================================
// DISPLAY SANDWICH TYPES
// ==========================================

function displaySandwichTypes(
    orders
) {

    displayProductTypes(
        "sandwichTypes",
        orders,
        "No sandwiches were found in the PDF."
    );
}


// ==========================================
// DISPLAY SALAD TYPES
// ==========================================

function displaySaladTypes(
    orders
) {

    displayProductTypes(
        "saladTypes",
        orders,
        "No salads were found in the PDF."
    );
}


// ==========================================
// DISPLAY COMPOUND TYPES
// ==========================================

function displayCompoundTypes(
    orders
) {

    displayProductTypes(
        "compoundTypes",
        orders,
        "No compounds were found in the PDF."
    );
}


// ==========================================
// DISPLAY NEW PRODUCTS
// ==========================================

function displayNewProducts(
    products
) {

    const container =
        document.getElementById(
            "newPrepItems"
        );


    if (!container) {
        return;
    }


    let html = "";


    for (
        const product of products
    ) {

        html += `
            <div class="prep-row">

                <span class="prep-name">
                    ${product.name}
                </span>

                <span class="prep-quantity">
                    ${product.quantity}
                </span>

            </div>
        `;
    }


    if (!html) {

        container.innerHTML =
            "";

        return;
    }


    container.innerHTML = `

        <div class="new-prep-items">

            <h3>
                New item found
            </h3>

            ${html}

        </div>

    `;
}


// ==========================================
// CREATE PRINT SHEET
// ==========================================
//
// This creates a completely separate
// print-only layout.
//
// The normal calculator layout is NOT
// modified.
//
// Sandwiches become:
//
// Sandwich | Total | Sandwich | Total
//
// ==========================================

function createPrintSheet() {

    // --------------------------------------
    // Remove an old print sheet if one
    // somehow still exists.
    // --------------------------------------

    const oldPrintSheet =
        document.getElementById(
            "prepPrintSheet"
        );


    if (oldPrintSheet) {

        oldPrintSheet.remove();
    }


    // --------------------------------------
    // Get current orders
    // --------------------------------------

    const prepOrders =
        window.prepOrders;


    if (!prepOrders) {

        console.warn(
            "No prep orders available for printing."
        );

        return;
    }


    // ======================================
    // GET SANDWICHES
    // ======================================

    const sandwiches =
        Object.entries(
            prepOrders.sandwiches || {}
        );


    // ======================================
    // GET SALADS
    // ======================================

    const salads =
        Object.entries(
            prepOrders.salads || {}
        );


    // ======================================
    // CREATE PRINT SHEET
    // ======================================

    const printSheet =
        document.createElement(
            "div"
        );


    printSheet.id =
        "prepPrintSheet";


    // ======================================
    // SANDWICH PAGE
    // ======================================

    const sandwichPage =
        document.createElement(
            "div"
        );


    sandwichPage.className =
        "prep-print-page";


    // --------------------------------------
    // Heading
    // --------------------------------------

    const sandwichHeading =
        document.createElement(
            "h1"
        );


    sandwichHeading.textContent =
        "Sandwiches";


    sandwichPage.appendChild(
        sandwichHeading
    );


    // --------------------------------------
    // Four-column table
    // --------------------------------------

    const sandwichTable =
        document.createElement(
            "table"
        );


    sandwichTable.className =
        "prep-print-table";


    // --------------------------------------
    // Table header
    // --------------------------------------

    const sandwichHeader =
        document.createElement(
            "tr"
        );


    sandwichHeader.innerHTML = `
        <th>Sandwich</th>
        <th>Total</th>
        <th>Sandwich</th>
        <th>Total</th>
    `;


    sandwichTable.appendChild(
        sandwichHeader
    );


    // ======================================
    // SPLIT SANDWICHES INTO TWO SIDES
    // ======================================
    //
    // Example:
    //
    // 40 sandwiches
    //
    // Left side  = 20
    // Right side = 20
    //
    // ======================================

    const middle =
        Math.ceil(
            sandwiches.length / 2
        );


    const leftSandwiches =
        sandwiches.slice(
            0,
            middle
        );


    const rightSandwiches =
        sandwiches.slice(
            middle
        );


    // ======================================
    // CREATE ROWS
    // ======================================

    const numberOfRows =
        Math.max(
            leftSandwiches.length,
            rightSandwiches.length
        );


    for (
        let i = 0;
        i < numberOfRows;
        i++
    ) {

        const row =
            document.createElement(
                "tr"
            );


        // ----------------------------------
        // LEFT SANDWICH
        // ----------------------------------

        if (
            leftSandwiches[i]
        ) {

            const [
                name,
                quantity
            ] =
                leftSandwiches[i];


            row.innerHTML += `
                <td>
                    ${name}
                </td>

                <td class="print-total">
                    ${quantity}
                </td>
            `;

        } else {

            row.innerHTML += `
                <td></td>
                <td></td>
            `;
        }


        // ----------------------------------
        // RIGHT SANDWICH
        // ----------------------------------

        if (
            rightSandwiches[i]
        ) {

            const [
                name,
                quantity
            ] =
                rightSandwiches[i];


            row.innerHTML += `
                <td>
                    ${name}
                </td>

                <td class="print-total">
                    ${quantity}
                </td>
            `;

        } else {

            row.innerHTML += `
                <td></td>
                <td></td>
            `;
        }


        sandwichTable.appendChild(
            row
        );
    }


    sandwichPage.appendChild(
        sandwichTable
    );


    printSheet.appendChild(
        sandwichPage
    );


    // ======================================
    // SALAD PAGE
    // ======================================

    const saladPage =
        document.createElement(
            "div"
        );


    saladPage.className =
        "prep-print-page prep-print-salad-page";


    // --------------------------------------
    // Heading
    // --------------------------------------

    const saladHeading =
        document.createElement(
            "h1"
        );


    saladHeading.textContent =
        "Salads";


    saladPage.appendChild(
        saladHeading
    );


    // --------------------------------------
    // Salad table
    // --------------------------------------

    const saladTable =
        document.createElement(
            "table"
        );


    saladTable.className =
        "prep-print-table";


    // --------------------------------------
    // Salad header
    // --------------------------------------

    const saladHeader =
        document.createElement(
            "tr"
        );


    saladHeader.innerHTML = `
        <th>Salad</th>
        <th>Total</th>
        <th>Salad</th>
        <th>Total</th>
    `;


    saladTable.appendChild(
        saladHeader
    );


    // ======================================
    // SPLIT SALADS
    // ======================================

    const saladMiddle =
        Math.ceil(
            salads.length / 2
        );


    const leftSalads =
        salads.slice(
            0,
            saladMiddle
        );


    const rightSalads =
        salads.slice(
            saladMiddle
        );


    const saladRows =
        Math.max(
            leftSalads.length,
            rightSalads.length
        );


    // ======================================
    // CREATE SALAD ROWS
    // ======================================

    for (
        let i = 0;
        i < saladRows;
        i++
    ) {

        const row =
            document.createElement(
                "tr"
            );


        // ----------------------------------
        // LEFT SALAD
        // ----------------------------------

        if (
            leftSalads[i]
        ) {

            const [
                name,
                quantity
            ] =
                leftSalads[i];


            row.innerHTML += `
                <td>
                    ${name}
                </td>

                <td class="print-total">
                    ${quantity}
                </td>
            `;

        } else {

            row.innerHTML += `
                <td></td>
                <td></td>
            `;
        }


        // ----------------------------------
        // RIGHT SALAD
        // ----------------------------------

        if (
            rightSalads[i]
        ) {

            const [
                name,
                quantity
            ] =
                rightSalads[i];


            row.innerHTML += `
                <td>
                    ${name}
                </td>

                <td class="print-total">
                    ${quantity}
                </td>
            `;

        } else {

            row.innerHTML += `
                <td></td>
                <td></td>
            `;
        }


        saladTable.appendChild(
            row
        );
    }


    saladPage.appendChild(
        saladTable
    );


    printSheet.appendChild(
        saladPage
    );


    // ======================================
    // ADD TO DOCUMENT
    // ======================================

    document.body.appendChild(
        printSheet
    );
}


// ==========================================
// INITIALIZE PREP CALCULATOR
// ==========================================

export function initializePrepCalculator(
    readPDF
) {

    if (!prepPdfFile) {
        return;
    }


    // ======================================
    // PRINT BUTTON
    // ======================================

    const printPrepButton =
        document.getElementById(
            "printPrepButton"
        );


    if (printPrepButton) {

        printPrepButton.addEventListener(
            "click",
            function () {

                // ----------------------------------
                // Build the dedicated print sheet
                // ----------------------------------

                createPrintSheet();


                // ----------------------------------
                // Print
                // ----------------------------------

                window.print();

            }
        );
    }


    // ======================================
    // PDF UPLOAD
    // ======================================

    prepPdfFile.addEventListener(
        "change",
        async function () {

            const file =
                prepPdfFile.files[0];


            if (!file) {
                return;
            }


            // ----------------------------------
            // Status
            // ----------------------------------

            prepStatus.textContent =
                "Reading PDF...";


            prepCategories.style.display =
                "none";


            try {

                // ==================================
                // READ PDF
                // ==================================

                const prepPdfText =
                    await readPDF(file);


                console.log(
                    "PREP PDF:",
                    prepPdfText
                );


                // ==================================
                // SANDWICHES
                // ==================================

                const sandwichOrders =
                    findProducts(
                        prepPdfText,
                        breadRecipes
                    );


                console.log(
                    "PREP SANDWICHES FOUND:",
                    sandwichOrders
                );


                displaySandwichTypes(
                    sandwichOrders
                );


                // ==================================
                // SALADS
                // ==================================

                const saladOrders =
                    findProducts(
                        prepPdfText,
                        saladProductTypes
                    );


                console.log(
                    "PREP SALADS FOUND:",
                    saladOrders
                );


                displaySaladTypes(
                    saladOrders
                );


                // ==================================
                // COMPOUNDS
                // ==================================

                const compoundOrders =
                    findProducts(
                        prepPdfText,
                        compoundProductTypes
                    );


                console.log(
                    "PREP COMPOUNDS FOUND:",
                    compoundOrders
                );


                displayCompoundTypes(
                    compoundOrders
                );


                // ==================================
                // FIND NEW / UNKNOWN ITEMS
                // ==================================

                const newPrepItems =
                    findNewProducts(
                        prepPdfText,
                        allKnownPrepProducts
                    );


                console.log(
                    "NEW PREP ITEMS FOUND:",
                    newPrepItems
                );


                displayNewProducts(
                    newPrepItems
                );


                // ==================================
                // SAVE ALL PREP DATA
                // ==================================

                window.prepOrders = {

                    sandwiches:
                        sandwichOrders,

                    salads:
                        saladOrders,

                    compounds:
                        compoundOrders

                };


                // ==================================
                // SHOW PREP CATEGORIES
                // ==================================

                prepStatus.textContent =
                    "PDF loaded ✓";


                prepCategories.style.display =
                    "block";


            } catch (error) {

                console.error(
                    "Error reading Prep PDF:",
                    error
                );


                prepStatus.textContent =
                    "There was an error reading the PDF.";
            }

        }
    );
}