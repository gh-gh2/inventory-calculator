// ==========================================
// PRODUCT ALIASES
// ==========================================
//
// The name used by the calculator does not
// always exactly match the name in the PDF.
// ==========================================

const productAliases = {

    // ==========================================
    // SANDWICHES
    // ==========================================

    "Challah Turkey & Swiss": [
        "Challah Turkey & Swiss",
        "Challah Turkey and Swiss",
        "Challah Turkey/Swiss"
    ],

    "Vending Turmeric Curry Garbanzo": [
        "Vending Turmeric Curry Garbanzo",
        "Turmeric Curry Garbanzo",
        "Turmeric Curry"
    ],


    // ==========================================
    // SALADS
    // ==========================================

    "Mediterranean (LG)": [
        "Mediterranean (LG)",
        "Mediterranean",
        "Mediterrane an (LG)",
        "Mediterrane an"
    ],


    // ==========================================
    // COMPOUNDS
    // ==========================================

    "8oz Strawberry": [
        "8oz Strawberry",
        "Strawberry C 8",
        "Strawberry"
    ],

    "Broccoli/Slaw Craisin 8oz": [
        "Broccoli/Slaw Craisin 8oz",
        "Broccoli/Slaw Craisin",
        "Broccoli Slaw Craisin 8oz"
    ],

    "Bean Dip": [
        "Bean Dip",
        "Bean 16 oz",
        "Bean"
    ],


    // ==========================================
    // LARGE TAKEOUT COMPOUNDS
    // ==========================================

    "Deli Pasta 7.5 lb Bowl Take Out": [
        "Deli Pasta 7.5 lb Bowl Take Out",
        "Deli Pasta 7.5 Bowl Take Out",
        "Deli Pasta 7.5 lb Bowl Take Out@"
    ],

    "Broccoli/Kale Slaw 5 lb Bowl Take Out": [
        "Broccoli/Kale Slaw 5 lb Bowl Take Out",
        "Broccoli/Kale Slaw 5 Bowl Take Out",
        "Broccoli/Kale Slaw 5 lb Bowl Take Out@",
        "Broccoli Kale Slaw 5 Bowl Take Out"
    ],


    // ==========================================
    // FUTURE COMPOUNDS
    // ==========================================

    "Honey Butter": [
        "Honey Butter"
    ],

    "Wild Berry Cream Cheese": [
        "Wild Berry Cream Cheese"
    ],

    "Plain Cream Cheese": [
        "Plain Cream Cheese"
    ],

    "Onion and Chives Cream Cheese": [
        "Onion and Chives Cream Cheese"
    ],

    "Strawberry Cream Cheese": [
        "Strawberry Cream Cheese"
    ],

    "Honey Nut Cream Cheese": [
        "Honey Nut Cream Cheese"
    ]
};



// ==========================================
// FIND PRODUCTS
// ==========================================

export function findProducts(
    pdfText,
    productRecipes
) {

    const orders = {};


    // ------------------------------------------
    // SAFETY CHECK
    // ------------------------------------------

    if (
        !productRecipes ||
        typeof productRecipes !== "object"
    ) {

        throw new Error(
            "productRecipes must be an object."
        );
    }


    // ------------------------------------------
    // GET PRODUCTION DAYS
    // ------------------------------------------

    const productionDays =
        getProductionDays(
            pdfText
        );


    console.log(
        `Production days used for CONE: ${productionDays}`
    );


    // ------------------------------------------
    // LOOP THROUGH PRODUCTS
    // ------------------------------------------

    for (
        const product of Object.keys(productRecipes)
    ) {

        const recipe =
            productRecipes[product];


        if (!recipe) {
            continue;
        }


        // ------------------------------------------
        // FIND PRODUCT TOTAL
        // ------------------------------------------

        const total =
            findProductTotal(
                pdfText,
                product
            );


        if (total === null) {
            continue;
        }


        // ==========================================
        // PRODUCTS THAT EXCLUDE CONE
        // ==========================================

        if (recipe.excludeCONE) {

            const conePerDay = 2;

            const totalCONE =
                conePerDay *
                productionDays;


            const ourQuantity =
                Math.max(
                    0,
                    total - totalCONE
                );


            console.log(
                `${product}: ` +
                `Total=${total}, ` +
                `CONE/day=${conePerDay}, ` +
                `Production days=${productionDays}, ` +
                `Total CONE=${totalCONE}, ` +
                `Our quantity=${ourQuantity}`
            );


            orders[product] =
                ourQuantity;

        } else {

            // ======================================
            // NORMAL PRODUCT
            // ======================================

            orders[product] =
                total;
        }
    }


    return orders;
}



// ==========================================
// FIND PRODUCT TOTAL
// ==========================================

function findProductTotal(
    pdfText,
    product
) {

    // ------------------------------------------
    // Get aliases
    // ------------------------------------------

    let searchTerms = [
        product
    ];


    if (
        productAliases[product]
    ) {

        searchTerms = [
            ...productAliases[product]
        ];
    }


    // ------------------------------------------
    // Try every possible name
    // ------------------------------------------

    for (
        const searchTerm of searchTerms
    ) {

        const total =
            findProductTotalUsingName(
                pdfText,
                searchTerm
            );


        if (
            total !== null
        ) {

            return total;
        }
    }


    // ------------------------------------------
    // Product not found
    // ------------------------------------------

    console.warn(
        `Product not found: ${product}`
    );


    return null;
}



// ==========================================
// FIND PRODUCT USING NAME
// ==========================================

function findProductTotalUsingName(
    pdfText,
    product
) {

    // ==========================================
    // NORMALIZED TEXT
    // ==========================================

    const normalizedText =
        normalizePdfText(
            pdfText
        );


    const normalizedProduct =
        normalizePdfText(
            product
        );


    // ==========================================
    // COMPACT TEXT
    // ==========================================

    const compactText =
        compactPdfText(
            pdfText
        );


    const compactProduct =
        compactPdfText(
            product
        );


    // ==========================================
    // NORMAL MATCH
    // ==========================================

    const normalTotal =
        findUsingNormalizedText(
            normalizedText,
            normalizedProduct
        );


    if (
        normalTotal !== null
    ) {

        return normalTotal;
    }


    // ==========================================
    // COMPACT MATCH
    // ==========================================

    const compactTotal =
        findUsingCompactText(
            compactText,
            compactProduct
        );


    if (
        compactTotal !== null
    ) {

        return compactTotal;
    }


    return null;
}



// ==========================================
// NORMALIZED TEXT MATCH
// ==========================================

function findUsingNormalizedText(
    text,
    product
) {

    const escapedProduct =
        escapeRegex(
            product
        );


    // ------------------------------------------
    // EA
    // ------------------------------------------

    const eaPattern =
        new RegExp(
            escapedProduct +
            "(?:\\s*-?\\s*1\\s*each)?\\s+" +
            "EA\\s+" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    let match =
        text.match(
            eaPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // Flexible EA
    // ------------------------------------------

    const flexibleEaPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,100}?" +
            "EA\\s+" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            flexibleEaPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // CO
    // ------------------------------------------

    const coPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,100}?" +
            "CO\\s+" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            coPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // QT
    // ------------------------------------------

    const qtPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,100}?" +
            "QT\\s+" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            qtPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    return null;
}



// ==========================================
// COMPACT TEXT MATCH
// ==========================================

function findUsingCompactText(
    text,
    product
) {

    const escapedProduct =
        escapeRegex(
            product
        );


    // ------------------------------------------
    // EA
    // ------------------------------------------

    const eaPattern =
        new RegExp(
            escapedProduct +
            "(?:-?1each)?" +
            "EA" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    let match =
        text.match(
            eaPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // Flexible EA
    // ------------------------------------------

    const flexibleEaPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,150}?" +
            "EA" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            flexibleEaPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // CO
    // ------------------------------------------

    const coPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,150}?" +
            "CO" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            coPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    // ------------------------------------------
    // QT
    // ------------------------------------------

    const qtPattern =
        new RegExp(
            escapedProduct +
            "[\\s\\S]{0,150}?" +
            "QT" +
            "(\\d+(?:,\\d{3})*(?:\\.\\d+)?)",
            "i"
        );


    match =
        text.match(
            qtPattern
        );


    if (match) {

        return parseNumber(
            match[1]
        );
    }


    return null;
}



// ==========================================
// NORMALIZE PDF TEXT
// ==========================================

function normalizePdfText(
    text
) {

    if (!text) {
        return "";
    }


    return text
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}



// ==========================================
// COMPACT PDF TEXT
// ==========================================

function compactPdfText(
    text
) {

    if (!text) {
        return "";
    }


    return text
        .replace(/\s+/g, "")
        .toLowerCase();
}



// ==========================================
// ESCAPE REGEX
// ==========================================

function escapeRegex(
    text
) {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}



// ==========================================
// PARSE NUMBER
// ==========================================

function parseNumber(
    value
) {

    return parseFloat(
        value.replace(
            /,/g,
            ""
        )
    );
}



// ==========================================
// GET PRODUCTION DAYS
// ==========================================

function getProductionDays(
    pdfText
) {

    const reportPattern =
        /Daily Production Report\s+(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})/i;


    const match =
        pdfText.match(
            reportPattern
        );


    if (!match) {

        console.warn(
            "Could not find report date range."
        );

        return 1;
    }


    const startDate =
        parseReportDate(
            match[1]
        );


    const endDate =
        parseReportDate(
            match[2]
        );


    if (
        !startDate ||
        !endDate
    ) {

        console.warn(
            "Could not parse report dates."
        );

        return 1;
    }


    let productionDays = 0;


    const currentDate =
        new Date(
            startDate
        );


    while (
        currentDate <= endDate
    ) {

        const dayOfWeek =
            currentDate.getDay();


        // Sunday = 0
        //
        // Everything except Sunday counts.

        if (
            dayOfWeek !== 0
        ) {

            productionDays++;
        }


        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }


    console.log(
        `Report period: ${match[1]} - ${match[2]}`
    );


    console.log(
        `Production days (excluding Sundays): ${productionDays}`
    );


    return Math.max(
        1,
        productionDays
    );
}



// ==========================================
// PARSE REPORT DATE
// ==========================================

function parseReportDate(
    dateString
) {

    const parts =
        dateString.split("/");


    if (
        parts.length !== 3
    ) {

        return null;
    }


    const month =
        Number(parts[0]) - 1;


    const day =
        Number(parts[1]);


    const year =
        Number(parts[2]);


    const date =
        new Date(
            year,
            month,
            day
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }


    return date;
}



// ==========================================
// FIND NEW / UNKNOWN PRODUCTS
// ==========================================
//
// This parser is intentionally separate from
// findProducts().
//
// The PDF extraction does NOT preserve rows
// cleanly. Product names and quantities can
// appear on separate lines.
//
// We therefore:
//
// 1. Look for FG CSC sections
// 2. Identify the product category
// 3. Extract candidate product names
// 4. Find their associated quantity
// 5. Ignore known products
// 6. Ignore aliases
// 7. Ignore obvious PDF report formatting
//
// ==========================================

export function findNewProducts(
    pdfText,
    knownProductRecipes
) {

    const newProducts = [];


    if (
        !pdfText ||
        !knownProductRecipes
    ) {

        return newProducts;
    }


    const knownNames =
        Object.keys(
            knownProductRecipes
        );


    // ==========================================
    // NORMALIZE LINE BREAKS
    // ==========================================

    const text =
        pdfText
            .replace(/\r/g, "\n")
            .replace(/\t/g, " ");


    // ==========================================
    // SPLIT INTO FG CSC SECTIONS
    // ==========================================

    const sections =
        text.split(
            /FG CSC\s+/i
        );


    // ==========================================
    // PROCESS EACH SECTION
    // ==========================================

    for (
        const section of sections
    ) {

        if (
            !section.trim()
        ) {
            continue;
        }


        // --------------------------------------
        // Determine section category
        // --------------------------------------

        const category =
            getProductCategory(
                section
            );


        if (!category) {
            continue;
        }


        // --------------------------------------
        // Extract candidates
        // --------------------------------------

        const candidates =
            extractProductCandidates(
                section,
                category
            );


        // --------------------------------------
        // Process candidates
        // --------------------------------------

        for (
            const candidate of candidates
        ) {

            const productName =
                cleanDetectedProductName(
                    candidate.name
                );


            if (!productName) {
                continue;
            }


            // ======================================
            // IGNORE PDF REPORT FORMATTING
            // ======================================
            //
            // Example:
            //
            // 2.00 - - - 2.00 FG SALAD GREEN
            // Mediterrane an (LG)
            //
            // These are report rows, not new
            // products.
            //
            // ======================================

            if (
                /\bFG\s+SALAD\s+GREEN\b/i.test(
                    productName
                )
            ) {
                continue;
            }


            if (
                /^\s*\d+(?:\.\d+)?\s+-/.test(
                    productName
                )
            ) {
                continue;
            }


            const quantity =
                candidate.quantity;


            if (
                quantity === null ||
                Number.isNaN(quantity)
            ) {
                continue;
            }


            // ==================================
            // CHECK KNOWN PRODUCTS
            // ==================================

            const isKnown =
                knownNames.some(
                    knownName =>
                        productNamesMatch(
                            productName,
                            knownName
                        )
                );


            if (isKnown) {
                continue;
            }


            // ==================================
            // CHECK ALIASES
            // ==================================

            const matchesAlias =
                Object.entries(
                    productAliases
                ).some(
                    ([knownName, aliases]) => {

                        return aliases.some(
                            alias =>
                                productNamesMatch(
                                    productName,
                                    alias
                                )
                        );
                    }
                );


            if (matchesAlias) {
                continue;
            }


            // ==================================
            // ADD / COMBINE DUPLICATES
            // ==================================

            const existing =
                newProducts.find(
                    item =>
                        productNamesMatch(
                            item.name,
                            productName
                        )
                );


            if (existing) {

                existing.quantity +=
                    quantity;

            } else {

                newProducts.push({

                    name:
                        productName,

                    quantity:
                        quantity,

                    category:
                        category
                });
            }
        }
    }


    // ==========================================
    // REMOVE CATEGORY FROM OUTPUT OBJECT
    // ==========================================
    //
    // The category is useful internally but
    // the UI only needs name + quantity.
    //
    // ==========================================

    return newProducts.map(
        item => ({

            name:
                item.name,

            quantity:
                item.quantity
        })
    );
}



// ==========================================
// GET PRODUCT CATEGORY
// ==========================================

function getProductCategory(
    section
) {

    const upper =
        section
            .substring(
                0,
                150
            )
            .toUpperCase();


    // ------------------------------------------
    // SANDWICH
    // ------------------------------------------

    if (
        upper.includes("SANDWICH")
    ) {

        return "sandwich";
    }


    // ------------------------------------------
    // SALAD
    // ------------------------------------------

    if (
        upper.includes("SALAD")
    ) {

        return "salad";
    }


    // ------------------------------------------
    // GM / COMPOUND
    // ------------------------------------------

    if (
        upper.includes("GM")
    ) {

        return "compound";
    }


    return null;
}



// ==========================================
// EXTRACT PRODUCT CANDIDATES
// ==========================================

function extractProductCandidates(
    section,
    category
) {

    const candidates = [];


    // ==========================================
    // CLEAN SECTION
    // ==========================================

    let text =
        section
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    // ==========================================
    // STOP AT TOTALS
    // ==========================================

    text =
        text.split(
            /\bTotal\b/i
        )[0];


    // ==========================================
    // PRODUCT MARKERS
    // ==========================================
    //
    // Product rows normally contain:
    //
    // Product Name
    // 1 each EA
    //
    // OR
    //
    // Product Name EA
    //
    // OR
    //
    // Product Name CO
    //
    // ==========================================

    const pattern =
        /(.+?)(?:\s+1\s+each)?\s+(EA|CO|QT|C\s+8)\s+(-?\s*(?:\d+(?:,\d{3})*(?:\.\d+)?|-))/gi;


    let match;


    while (
        (match = pattern.exec(text)) !== null
    ) {

        let name =
            match[1].trim();


        const unit =
            match[2]
                .toUpperCase();


        const quantityText =
            match[3].trim();


        // --------------------------------------
        // Ignore blank / dash quantities
        // --------------------------------------

        if (
            quantityText === "-" ||
            quantityText === ""
        ) {
            continue;
        }


        const quantity =
            parseNumber(
                quantityText
            );


        if (
            Number.isNaN(quantity)
        ) {
            continue;
        }


        // --------------------------------------
        // Clean name
        // --------------------------------------

        name =
            cleanDetectedProductName(
                name
            );


        // --------------------------------------
        // Remove category prefixes
        // --------------------------------------

        name =
            removeCategoryWords(
                name
            );


        // --------------------------------------
        // Remove obvious report garbage
        // --------------------------------------

        name =
            cleanProductGarbage(
                name
            );


        if (
            !name
        ) {
            continue;
        }


        // --------------------------------------
        // Make sure this actually looks like
        // a product.
        // --------------------------------------

        if (
            !looksLikeProductName(
                name
            )
        ) {
            continue;
        }


        candidates.push({

            name:
                name,

            quantity:
                quantity,

            unit:
                unit
        });
    }


    // ==========================================
    // SECOND PASS
    // ==========================================
    //
    // Some products appear as:
    //
    // FG CSC SANDWICH Crunch
    // 1
    //
    // Because the PDF puts the quantity on
    // its own line.
    //
    // ==========================================

    const lines =
        section
            .split(/\n+/)
            .map(
                line =>
                    line.trim()
            )
            .filter(
                line =>
                    line
            );


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i];


        // --------------------------------------
        // Skip lines that clearly contain units
        // --------------------------------------

        if (
            /\b(EA|CO|QT|C\s+8|LB)\b/i.test(
                line
            )
        ) {
            continue;
        }


        // --------------------------------------
        // Skip obvious PDF report rows
        // --------------------------------------

        if (
            /^\s*\d+(?:\.\d+)?\s+-/.test(
                line
            )
        ) {
            continue;
        }


        if (
            /\bFG\s+SALAD\s+GREEN\b/i.test(
                line
            )
        ) {
            continue;
        }


        // --------------------------------------
        // Quantity on next line
        // --------------------------------------

        if (
            i + 1 < lines.length &&
            /^\s*\d+(?:,\d{3})*(?:\.\d+)?\s*$/.test(
                lines[i + 1]
            )
        ) {

            let name =
                cleanDetectedProductName(
                    line
                );


            name =
                removeCategoryWords(
                    name
                );


            name =
                cleanProductGarbage(
                    name
                );


            const quantity =
                parseNumber(
                    lines[i + 1]
                );


            if (
                name &&
                looksLikeProductName(
                    name
                )
            ) {

                // ----------------------------------
                // Final report-row protection
                // ----------------------------------

                if (
                    /\bFG\s+SALAD\s+GREEN\b/i.test(
                        name
                    )
                ) {
                    continue;
                }


                if (
                    /^\s*\d+(?:\.\d+)?\s+-/.test(
                        name
                    )
                ) {
                    continue;
                }


                candidates.push({

                    name:
                        name,

                    quantity:
                        quantity,

                    unit:
                        "EA"
                });
            }
        }
    }


    return candidates;
}



// ==========================================
// REMOVE CATEGORY WORDS
// ==========================================

function removeCategoryWords(
    name
) {

    let cleaned =
        name;


    cleaned =
        cleaned.replace(
            /^SANDWICH\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^SALAD\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^SALAD\s+GREEN\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^GREEN\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^GM\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^MTC\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^CONCESSION\s+S\s+ONLY\s+/i,
            ""
        );


    return cleaned.trim();
}



// ==========================================
// CLEAN PRODUCT GARBAGE
// ==========================================

function cleanProductGarbage(
    name
) {

    let cleaned =
        name;


    // ------------------------------------------
    // Remove leading report prefixes
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /^(?:FG\s+CSC\s+)+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^(?:FG\s+)?CSC\s+/i,
            ""
        );


    // ------------------------------------------
    // Remove category prefixes
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /^(?:SANDWICH|SALAD|GREEN|GM|MTC)\s+/i,
            ""
        );


    // ------------------------------------------
    // Remove delivery notes
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s*\(Wed\.\s*&\s*Fri\s*Delivery\)\s*/gi,
            ""
        );


    // ------------------------------------------
    // Remove "1 each"
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+1\s+each\s*$/i,
            ""
        );


    // ------------------------------------------
    // Remove standalone report markers
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\b(?:EA|CO|QT|C\s+8|LB)\b/gi,
            ""
        );


    // ------------------------------------------
    // Remove obvious report-column garbage
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+-\s*/g,
            " "
        );


    // ------------------------------------------
    // Remove duplicate whitespace
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+/g,
            " "
        );


    return cleaned.trim();
}



// ==========================================
// CLEAN DETECTED PRODUCT NAME
// ==========================================

function cleanDetectedProductName(
    name
) {

    let cleaned =
        name.trim();


    // ------------------------------------------
    // Remove report category prefixes
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /^GM\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^MTC\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^SANDWICH\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^SALAD\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^SALAD\s+GREEN\s+/i,
            ""
        );


    cleaned =
        cleaned.replace(
            /^GREEN\s+/i,
            ""
        );


    // ------------------------------------------
    // Remove "1 each" from end
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+1\s+each\s*$/i,
            ""
        );


    // ------------------------------------------
    // Remove delivery notes
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s*\(Wed\.\s*&\s*Fri\s*Delivery\)\s*/gi,
            ""
        );


    // ------------------------------------------
    // Collapse whitespace
    // ------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+/g,
            " "
        );


    return cleaned.trim();
}



// ==========================================
// LOOKS LIKE PRODUCT NAME
// ==========================================

function looksLikeProductName(
    name
) {

    if (
        !name
    ) {
        return false;
    }


    const cleaned =
        name.trim();


    // ------------------------------------------
    // Too short
    // ------------------------------------------

    if (
        cleaned.length < 2
    ) {
        return false;
    }


    // ------------------------------------------
    // Pure number
    // ------------------------------------------

    if (
        /^\d+(?:\.\d+)?$/.test(
            cleaned
        )
    ) {
        return false;
    }


    // ------------------------------------------
    // Report garbage
    // ------------------------------------------

    if (
        /^(?:Total|CSC Garde Manger Total|Dining Services Total)/i.test(
            cleaned
        )
    ) {
        return false;
    }


    // ------------------------------------------
    // Date
    // ------------------------------------------

    if (
        /^\d{2}\/\d{2}\/\d{4}/.test(
            cleaned
        )
    ) {
        return false;
    }


    return true;
}



// ==========================================
// PRODUCT NAME COMPARISON
// ==========================================

function productNamesMatch(
    nameA,
    nameB
) {

    const normalize =
        name =>
            name
                .toLowerCase()
                .replace(
                    /\s+/g,
                    " "
                )
                .replace(
                    /[^a-z0-9]+/g,
                    ""
                );


    return (
        normalize(nameA) ===
        normalize(nameB)
    );
}