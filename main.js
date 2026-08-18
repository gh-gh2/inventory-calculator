import {
    readPDF
} from "./pdfReader.js";

import {
    initializeBreadOrder
} from "./breadOrder.js";

import {
    initializePrepCalculator
} from "./prepCalculator.js";


// ==========================================
// START MENU
// ==========================================

const startMenu =
    document.getElementById("startMenu");

const orderBreadSection =
    document.getElementById("orderBreadSection");

const prepSection =
    document.getElementById("prepSection");


// ==========================================
// ORDER BREAD BUTTON
// ==========================================

document
    .getElementById("orderBreadButton")
    .addEventListener("click", function () {

        startMenu.style.display = "none";

        orderBreadSection.style.display = "block";
    });


// ==========================================
// PREP BUTTON
// ==========================================

document
    .getElementById("prepButton")
    .addEventListener("click", function () {

        startMenu.style.display = "none";

        prepSection.style.display = "block";
    });


// ==========================================
// BACK TO MENU — ORDER BREAD
// ==========================================

document
    .getElementById("backToMenuButton")
    .addEventListener("click", function () {

        orderBreadSection.style.display = "none";

        startMenu.style.display = "block";
    });


// ==========================================
// BACK TO MENU — PREP
// ==========================================

document
    .getElementById("backToMenuFromPrepButton")
    .addEventListener("click", function () {

        prepSection.style.display = "none";

        startMenu.style.display = "block";
    });


// ==========================================
// PRINT PREP SHEET
// ==========================================

const printPrepButton =
    document.getElementById("printPrepButton");


if (printPrepButton) {

    printPrepButton.addEventListener(
        "click",
        function () {

            // --------------------------------------
            // Make sure a PDF has been loaded
            // --------------------------------------

            if (!window.prepOrders) {

                alert(
                    "Please load a production PDF before printing."
                );

                return;
            }


            // --------------------------------------
            // Get sandwich and salad data
            // --------------------------------------

            const sandwiches =
                window.prepOrders.sandwiches || {};

            const salads =
                window.prepOrders.salads || {};


            // --------------------------------------
            // Create rows
            // --------------------------------------

            function createRows(orders) {

                let rows = "";

                for (
                    const product in orders
                ) {

                    rows +=
                        "<tr>" +
                            "<td>" +
                                product +
                            "</td>" +
                            "<td>" +
                                orders[product] +
                            "</td>" +
                        "</tr>";
                }


                if (rows === "") {

                    rows =
                        "<tr>" +
                            "<td colspan=\"2\">" +
                                "No items found." +
                            "</td>" +
                        "</tr>";
                }


                return rows;
            }


            // --------------------------------------
            // Open print window
            // --------------------------------------

            const printWindow =
                window.open("", "_blank");


            if (!printWindow) {

                alert(
                    "The print window was blocked. Please allow pop-ups for this site."
                );

                return;
            }


            // --------------------------------------
            // Build print page
            // --------------------------------------

            let html = "";


            html += "<!DOCTYPE html>";
            html += "<html>";
            html += "<head>";

            html +=
                "<meta charset=\"UTF-8\">";

            html +=
                "<title>Prep Sheet</title>";


            // ======================================
            // PRINT STYLE
            // ======================================

            html += "<style>";

            html +=
                "@page {" +
                    "size: Letter;" +
                    "margin: 0.5in;" +
                "}";

            html +=
                "body {" +
                    "font-family: Arial, Helvetica, sans-serif;" +
                    "margin: 0;" +
                    "padding: 0;" +
                "}";

            html +=
                ".page {" +
                    "page-break-after: always;" +
                "}";

            html +=
                ".page:last-child {" +
                    "page-break-after: auto;" +
                "}";

            html +=
                "h1 {" +
                    "font-size: 24px;" +
                    "margin: 0 0 8px 0;" +
                "}";

            html +=
                ".date {" +
                    "font-size: 14px;" +
                    "margin-bottom: 20px;" +
                "}";

            html +=
                "table {" +
                    "width: 100%;" +
                    "border-collapse: collapse;" +
                "}";

            html +=
                "th, td {" +
                    "border: 1px solid black;" +
                    "padding: 8px;" +
                    "text-align: left;" +
                "}";

            html +=
                "th:last-child, td:last-child {" +
                    "width: 120px;" +
                    "text-align: center;" +
                "}";

            html +=
                "tr {" +
                    "page-break-inside: avoid;" +
                "}";

            html += "</style>";

            html += "</head>";
            html += "<body>";


            // ======================================
            // PAGE 1 — SANDWICHES
            // ======================================

            html +=
                "<div class=\"page\">";

            html +=
                "<h1>" +
                    "Sandwiches - Today's Prep" +
                "</h1>";

            html +=
                "<div class=\"date\">" +
                    new Date().toLocaleDateString() +
                "</div>";

            html += "<table>";

            html += "<thead>";

            html += "<tr>";

            html +=
                "<th>Sandwich</th>";

            html +=
                "<th>Quantity</th>";

            html += "</tr>";

            html += "</thead>";

            html += "<tbody>";

            html +=
                createRows(
                    sandwiches
                );

            html += "</tbody>";

            html += "</table>";

            html += "</div>";


            // ======================================
            // PAGE 2 — SALADS
            // ======================================

            html +=
                "<div class=\"page\">";

            html +=
                "<h1>" +
                    "Salads - Today's Prep" +
                "</h1>";

            html +=
                "<div class=\"date\">" +
                    new Date().toLocaleDateString() +
                "</div>";

            html += "<table>";

            html += "<thead>";

            html += "<tr>";

            html +=
                "<th>Salad</th>";

            html +=
                "<th>Quantity</th>";

            html += "</tr>";

            html += "</thead>";

            html += "<tbody>";

            html +=
                createRows(
                    salads
                );

            html += "</tbody>";

            html += "</table>";

            html += "</div>";


            // ======================================
            // FINISH DOCUMENT
            // ======================================

            html += "</body>";
            html += "</html>";


            // --------------------------------------
            // Write to print window
            // --------------------------------------

            printWindow.document.open();

            printWindow.document.write(
                html
            );

            printWindow.document.close();


            // --------------------------------------
            // Print
            // --------------------------------------

            setTimeout(
                function () {

                    printWindow.focus();

                    printWindow.print();

                },
                500
            );
        }
    );
}


// ==========================================
// INITIALIZE MODULES
// ==========================================

initializeBreadOrder(
    readPDF
);

initializePrepCalculator(
    readPDF
);