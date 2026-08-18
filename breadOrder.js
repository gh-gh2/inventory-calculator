import {
    findProducts
} from "./productParser.js";


// ==========================================
// BREAD ORDER SETTINGS
// ==========================================

const SANDWICHES_PER_PACKAGE = {

    "White": 9,

    "Wheat": 9,

    "Sprout": 6,

    "Sourdough": 8,

    "Honey": 8,

    "Ciabatta": 12,

    "Hoagie": 12
};


const BREAD_TYPES = [
    "White",
    "Wheat",
    "Sprout",
    "Sourdough",
    "Honey",
    "Ciabatta",
    "Hoagie"
];


const STORAGE_KEY =
    "inventoryCalculatorPreviousOrder";


let lastCalculatedOrder = null;


// ==========================================
// BREAD RECIPES
// ==========================================

export const breadRecipes = {

    // ======================================
    // SANDWICHES
    // ======================================

    "Wedge White PB&J": {
        bread: "White",
        units: 1,
        order: true
    },

    "Wedge Tuna Wheat": {
        bread: "Wheat",
        units: 1,
        order: true
    },

    "Wedge Egg Wheat": {
        bread: "Wheat",
        units: 1,
        order: true
    },

    "Sprout Vegetarian Pillow": {
        bread: "Sprout",
        units: 1,
        order: true
    },

    "Sprout Turkey Cranberry Pillow": {
        bread: "Sprout",
        units: 1,
        order: true
    },

    "Crunch": {
        bread: "Sprout",
        units: 1,
        order: true
    },

    "Roast Beef on Sourdough": {
        bread: "Sourdough",
        units: 1,
        order: true
    },

    "Sweet Heat": {
        bread: "Honey",
        units: 1,
        order: true
    },

    "Pit Beef": {
        bread: "Honey",
        units: 1,
        order: true
    },

    "Panini Turkey, Bacon, Avocado": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Panini Italian": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Panini Bacon Egg Cheese": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Sausage Egg Panini": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Deli Ham & Cheddar": {
        bread: "Hoagie",
        units: 1,
        order: true
    },

    "Deli Turkey & Swiss": {
        bread: "Hoagie",
        units: 1,
        order: true
    },

    "Turkey Cranberry": {
        bread: "Sprout",
        units: 1,
        order: true
    },

    "Ciabatta Turkey": {
        bread: "Ciabatta",
        units: 1,
        order: true,
        excludeCONE: true
    },

    "Panini Turkey Provolone": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Heritage Panini Ham & Cheese": {
        bread: "Ciabatta",
        units: 1,
        order: true
    },

    "Ciabatta Ham and Cheese Pesto/ Concession S Only": {
        bread: "Ciabatta",
        units: 1,
        order: true,
        excludeCONE: true
    },


    // ======================================
    // SANDWICHES — REFERENCE ONLY
    // ======================================
    //
    // These are still sandwiches.
    //
    // They are NOT removed from the sandwich
    // list just because their bread is not
    // something we order.
    //
    // order:false means they do not affect
    // the bread order calculation.
    //
    // ======================================

    "Challah Turkey & Swiss": {
        bread: "Challah",
        units: 1,
        order: false,
        excludeCONE: true
    },

    "Challah Chicken BBQ": {
        bread: "Challah",
        units: 1,
        order: false
    },

    "Challah Chicken Bacon Ranch Asiago": {
        bread: "Challah",
        units: 1,
        order: false
    },

    "Challah Club": {
        bread: "Challah",
        units: 1,
        order: false
    },

    "Challah Italian": {
        bread: "Challah",
        units: 1,
        order: false
    },

    "Croissant Turkey/ Gouda": {
        bread: "Croissant",
        units: 1,
        order: false
    },

    "Croissant Chicken Salad": {
        bread: "Croissant",
        units: 1,
        order: false
    },

    "Croissant Ham & Swiss": {
        bread: "Croissant",
        units: 1,
        order: false
    },

    "Croissant Turkey/Swiss": {
        bread: "Croissant",
        units: 1,
        order: false
    },

    "Kaiser Club Gluten Free": {
        bread: "Gluten Free",
        units: 1,
        order: false
    },

    "Kaiser Italian Gluten Free": {
        bread: "Gluten Free",
        units: 1,
        order: false
    },

    "Kaiser Turkey and Swiss Gluten Free": {
        bread: "Gluten Free",
        units: 1,
        order: false
    },

    "Tortilla Club Wrap": {
        bread: "Tortilla",
        units: 1,
        order: false
    },

    "Vending Turmeric Curry Garbanzo": {
        bread: "Tortilla",
        units: 1,
        order: false
    }
};


// ==========================================
// CREATE INPUTS
// ==========================================

function createBreadInputs(
    containerId,
    prefix
) {

    const container =
        document.getElementById(
            containerId
        );

    container.innerHTML = "";

    for (const bread of BREAD_TYPES) {

        const row =
            document.createElement("div");

        row.className =
            "bread-input-row";

        row.innerHTML = `
            <label for="${prefix}-${bread}">
                ${bread}
            </label>

            <input
                type="number"
                id="${prefix}-${bread}"
                min="0"
                step="1"
                value="0"
            >
        `;

        container.appendChild(row);
    }
}


// ==========================================
// GET INPUT VALUES
// ==========================================

function getBreadInputValues(prefix) {

    const values = {};

    for (const bread of BREAD_TYPES) {

        const input =
            document.getElementById(
                `${prefix}-${bread}`
            );

        values[bread] =
            Number(input.value) || 0;
    }

    return values;
}


// ==========================================
// SET INPUT VALUES
// ==========================================

function setBreadInputValues(
    prefix,
    values
) {

    for (const bread of BREAD_TYPES) {

        const input =
            document.getElementById(
                `${prefix}-${bread}`
            );

        input.value =
            values[bread] ?? 0;
    }
}


// ==========================================
// LOAD PREVIOUS ORDER
// ==========================================

function loadPreviousOrder() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!saved) {
        return null;
    }

    try {

        const data =
            JSON.parse(saved);

        if (
            !data.date ||
            !data.packages
        ) {

            console.warn(
                "Old previous-order data found. Clearing it."
            );

            localStorage.removeItem(
                STORAGE_KEY
            );

            return null;
        }

        return data;

    } catch (error) {

        console.error(
            "Could not read saved previous order:",
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

        return null;
    }
}


// ==========================================
// SAVE PREVIOUS ORDER
// ==========================================

function savePreviousOrder() {

    const packages =
        getBreadInputValues(
            "previous"
        );

    const previousOrderDate =
        getExpectedPreviousOrderDate();

    const orderData = {

        date:
            previousOrderDate.toISOString(),

        packages:
            packages
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orderData)
    );

    updatePreviousOrderDisplay();
}


// ==========================================
// RESET PREVIOUS ORDER
// ==========================================

function resetPreviousOrder() {

    const confirmed =
        confirm(
            "Are you sure you want to reset the previous order? You will need to enter it again."
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        STORAGE_KEY
    );

    setBreadInputValues(
        "previous",
        {}
    );

    updatePreviousOrderDisplay();
}


// ==========================================
// SAVE TODAY'S ORDER
// ==========================================

function saveTodaysOrder() {

    if (!lastCalculatedOrder) {

        alert(
            "Please analyze a PDF first."
        );

        return;
    }

    const today =
        new Date();

    const existingOrder =
        loadPreviousOrder();

    let sameDayOrder = false;

    if (existingOrder) {

        const existingDate =
            new Date(existingOrder.date);

        sameDayOrder =
            existingDate.getFullYear() ===
                today.getFullYear() &&

            existingDate.getMonth() ===
                today.getMonth() &&

            existingDate.getDate() ===
                today.getDate();
    }

    const newPackages = {};

    for (const bread of BREAD_TYPES) {

        newPackages[bread] =
            lastCalculatedOrder[bread]
                .packagesToOrder;
    }

    if (sameDayOrder) {

        let message =
            "You may be ordering bread for today more than once.\n\n";

        message +=
            "This new order will ADD the following:\n\n";

        let hasNewBread = false;

        for (const bread of BREAD_TYPES) {

            const added =
                newPackages[bread] || 0;

            if (added > 0) {

                message +=
                    `${bread}: ${added} package(s)\n`;

                hasNewBread = true;
            }
        }

        if (!hasNewBread) {

            message +=
                "No additional bread.\n";
        }

        message +=
            "\nDo you want to add this order to today's existing order?";

        const confirmed =
            confirm(message);

        if (!confirmed) {
            return;
        }

        for (const bread of BREAD_TYPES) {

            const existing =
                existingOrder.packages[bread] || 0;

            const added =
                newPackages[bread] || 0;

            newPackages[bread] =
                existing + added;
        }
    }

    const orderData = {

        date:
            today.toISOString(),

        packages:
            newPackages
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orderData)
    );

    updatePreviousOrderDisplay();

    document
        .getElementById(
            "saveTodaysOrderButton"
        )
        .disabled = true;

    if (sameDayOrder) {

        alert(
            "Today's additional order has been added to the existing order."
        );

    } else {

        alert(
            "Today's order has been saved as the new previous order."
        );
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// ==========================================
// GET EXPECTED PREVIOUS ORDER DATE
// ==========================================

function getExpectedPreviousOrderDate() {

    const today = new Date();

    const dayOfWeek =
        today.getDay();

    const expectedDate =
        new Date(today);

    if (dayOfWeek === 1) {

        expectedDate.setDate(
            today.getDate() - 2
        );

    } else {

        expectedDate.setDate(
            today.getDate() - 1
        );
    }

    return expectedDate;
}


// ==========================================
// UPDATE PREVIOUS ORDER DISPLAY
// ==========================================

function updatePreviousOrderDisplay() {

    const status =
        document.getElementById(
            "previousOrderStatus"
        );

    const instructions =
        document.getElementById(
            "previousOrderInstructions"
        );

    const dateDisplay =
        document.getElementById(
            "previousOrderDate"
        );

    const saved =
        loadPreviousOrder();

    if (saved) {

        status.textContent =
            "Previous order loaded ✓";

        status.className =
            "saved-status";

        instructions.textContent =
            "The saved previous order is shown below. You can edit it if necessary.";

        dateDisplay.textContent =
            "Order Date: " +
            formatDate(
                saved.date
            );

        dateDisplay.className =
            "order-date";

        setBreadInputValues(
            "previous",
            saved.packages
        );

    } else {

        status.textContent =
            "No previous order saved.";

        status.className =
            "missing-status";

        instructions.textContent =
            "Since this is the first time using the calculator, enter yesterday's order below.";

        dateDisplay.textContent =
            "";

        dateDisplay.className =
            "";

        setBreadInputValues(
            "previous",
            {}
        );
    }

    checkPreviousOrderDate();
}


// ==========================================
// CHECK PREVIOUS ORDER DATE
// ==========================================

function checkPreviousOrderDate() {

    const saved =
        loadPreviousOrder();

    const warning =
        document.getElementById(
            "previousOrderDateWarning"
        );

    if (!warning) {
        return;
    }

    warning.textContent = "";
    warning.className = "";

    if (!saved) {
        return;
    }

    const expectedDate =
        getExpectedPreviousOrderDate();

    const savedDate =
        new Date(saved.date);

    const dateMatches =
        expectedDate.getFullYear() ===
            savedDate.getFullYear() &&

        expectedDate.getMonth() ===
            savedDate.getMonth() &&

        expectedDate.getDate() ===
            savedDate.getDate();

    if (!dateMatches) {

        warning.innerHTML = `
            ⚠️ <strong>Please verify the previous order date.</strong>
            <br>
            Based on the normal ordering schedule,
            the previous order would normally be
            <strong>${formatDate(expectedDate)}</strong>.
            <br>
            The saved order is from
            <strong>${formatDate(saved.date)}</strong>.
            <br>
            This may be correct if the location was closed,
            there was a holiday, or an order was missed.
        `;

        warning.className =
            "date-warning";

    } else {

        warning.innerHTML = `
            ✓ Previous order date matches the
            expected ordering schedule.
        `;

        warning.className =
            "date-ok";
    }
}


// ==========================================
// CALCULATE BREAD UNITS
// ==========================================

function calculateBread(
    orders
) {

    const breadTotals = {};

    for (
        const product in orders
    ) {

        const quantity =
            orders[product];

        const recipe =
            breadRecipes[product];

        if (!recipe) {
            continue;
        }

        if (!recipe.order) {
            continue;
        }

        const bread =
            recipe.bread;

        const unitsNeeded =
            quantity *
            recipe.units;

        if (!breadTotals[bread]) {
            breadTotals[bread] = 0;
        }

        breadTotals[bread] +=
            unitsNeeded;
    }

    return breadTotals;
}


// ==========================================
// CALCULATE FINAL ORDER
// ==========================================

function calculateFinalOrder(
    breadTotals
) {

    const previousOrder =
        loadPreviousOrder();

    const previousPackages =
        previousOrder
            ? previousOrder.packages
            : {};

    const currentSupply =
        getBreadInputValues(
            "inventory"
        );

    const finalOrder = {};

    for (const bread of BREAD_TYPES) {

        const sandwichesNeeded =
            breadTotals[bread] || 0;

        const sandwichesPerPackage =
            SANDWICHES_PER_PACKAGE[bread];

        const requiredPackages =
            Math.ceil(
                sandwichesNeeded /
                sandwichesPerPackage
            );

        const previous =
            previousPackages[bread] || 0;

        const supply =
            currentSupply[bread] || 0;

        const packagesToOrder =
            Math.max(
                0,
                requiredPackages -
                previous -
                supply
            );

        finalOrder[bread] = {

            unitsNeeded:
                sandwichesNeeded,

            requiredPackages:
                requiredPackages,

            previousOrder:
                previous,

            currentSupply:
                supply,

            packagesToOrder:
                packagesToOrder
        };
    }

    return finalOrder;
}


// ==========================================
// DISPLAY BREAD RESULTS
// ==========================================

function displayBreadResults(
    orders,
    breadTotals
) {

    const results =
        document.getElementById(
            "results"
        );

    let html = "";

    html += "<h2>Products Found</h2>";

    html += `
        <table>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
            </tr>
    `;

    for (const product in orders) {

        html += `
            <tr>
                <td>${product}</td>
                <td>${orders[product]}</td>
            </tr>
        `;
    }

    html += "</table>";

    const finalOrder =
        calculateFinalOrder(
            breadTotals
        );

    lastCalculatedOrder =
        finalOrder;

    html += "<h2>Bread to Order</h2>";

    html += `
        <table>
            <tr>
                <th>Bread</th>
                <th>Packages to Order</th>
            </tr>
    `;

    for (const bread of BREAD_TYPES) {

        const packages =
            finalOrder[bread]
                .packagesToOrder;

        html += `
            <tr>
                <td>${bread}</td>
                <td>
                    <strong>
                        ${packages}
                    </strong>
                </td>
            </tr>
        `;
    }

    html += "</table>";

    html += `
        <details class="calculation-details">

            <summary>
                Show Calculation Details
            </summary>

            <table>

                <tr>
                    <th>Bread</th>
                    <th>PDF Required</th>
                    <th>Required Packages</th>
                    <th>Previous Order</th>
                    <th>Current Supply</th>
                    <th>To Order</th>
                </tr>
    `;

    for (const bread of BREAD_TYPES) {

        const item =
            finalOrder[bread];

        html += `
            <tr>
                <td>${bread}</td>
                <td>${item.unitsNeeded}</td>
                <td>${item.requiredPackages}</td>
                <td>${item.previousOrder}</td>
                <td>${item.currentSupply}</td>
                <td>
                    <strong>
                        ${item.packagesToOrder}
                    </strong>
                </td>
            </tr>
        `;
    }

    html += `
            </table>

        </details>
    `;

    results.innerHTML =
        html;

    document
        .getElementById(
            "saveTodaysOrderButton"
        )
        .disabled = false;
}


// ==========================================
// PUBLIC FUNCTIONS
// ==========================================

export function initializeBreadOrder(
    readPDF
) {

    createBreadInputs(
        "inventoryInputs",
        "inventory"
    );

    createBreadInputs(
        "previousOrderInputs",
        "previous"
    );

    updatePreviousOrderDisplay();


    // ======================================
    // SAVE PREVIOUS ORDER
    // ======================================

    document
        .getElementById(
            "savePreviousOrderButton"
        )
        .addEventListener(
            "click",
            function () {

                savePreviousOrder();

                alert(
                    "Previous order saved."
                );
            }
        );


    // ======================================
    // RESET PREVIOUS ORDER
    // ======================================

    document
        .getElementById(
            "resetPreviousOrderButton"
        )
        .addEventListener(
            "click",
            function () {

                resetPreviousOrder();
            }
        );


    // ======================================
    // SAVE TODAY'S ORDER
    // ======================================

    document
        .getElementById(
            "saveTodaysOrderButton"
        )
        .addEventListener(
            "click",
            function () {

                saveTodaysOrder();

            }
        );


    // ======================================
    // ANALYZE BUTTON
    // ======================================

    document
        .getElementById(
            "analyzeButton"
        )
        .addEventListener(
            "click",
            async function () {

                const file =
                    document.getElementById(
                        "pdfFile"
                    ).files[0];

                const status =
                    document.getElementById(
                        "status"
                    );

                const results =
                    document.getElementById(
                        "results"
                    );


                if (!file) {

                    status.textContent =
                        "Please select a PDF first.";

                    return;
                }


                status.textContent =
                    "Reading PDF...";

                results.innerHTML =
                    "";


                try {

                    // ==================================
                    // READ PDF
                    // ==================================

                    const pdfText =
                        await readPDF(file);


                    console.log(
                        "PDF TEXT:",
                        pdfText
                    );


                    status.textContent =
                        "Finding products...";


                    // ==================================
                    // FIND PRODUCTS
                    // ==================================

                    const orders =
                        findProducts(
                            pdfText,
                            breadRecipes
                        );


                    console.log(
                        "PRODUCTS FOUND:",
                        orders
                    );


                    // ==================================
                    // CALCULATE BREAD
                    // ==================================

                    const breadTotals =
                        calculateBread(
                            orders
                        );


                    // ==================================
                    // DISPLAY RESULTS
                    // ==================================

                    displayBreadResults(
                        orders,
                        breadTotals
                    );


                    status.textContent =
                        "Analysis complete!";


                } catch (error) {

                    console.error(
                        "Bread order error:",
                        error
                    );

                    status.textContent =
                        "There was an error reading the PDF.";
                }
            }
        );
}