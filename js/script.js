// script.js
// Dungeon Loot Splitter

// Initializes Variables
let loot = [];

const partySize = document.getElementById("partySize");
const lootName = document.getElementById("lootName");
const lootValue = document.getElementById("lootValue");
const addLootButton = document.getElementById("addLoot");
const removeLootButton = document.getElementById("removeLoot");
const messageAdd = document.getElementById("messageAdd");
const lootList = document.getElementById("lootList");
const totalLoot = document.getElementById("totalLoot");
const splitLootButton = document.getElementById("splitLoot");
const totalLootSplit = document.getElementById("totalLootSplit");
const lootPerMember = document.getElementById("lootPerMember");
const messageSplit = document.getElementById("messageSplit");


addLootButton.addEventListener("click", addLoot);

removeLootButton.addEventListener("click", removeLoot);

splitLootButton.addEventListener("click", splitLoot);

function addLoot() {
    // Description: Adds loot to the loot array
    // Input: None
    // Output: Adds loot to the loot array

    // Initializes the name and value of the loot
    let name = lootName.value.trim();
    let value = Number(lootValue.value);
    let rarity = rarityGenerate();
    
    // Input validation
    if (name === "") {
        messageAdd.innerHTML = "Please enter a valid name.";
    }
    else if (isNaN(value) || value <= 0) {
        messageAdd.innerHTML = "Please enter a valid number.";
    }
    // If valid input, adds the loot to the loot array
    else { 
        // Modifies the value based on the rarity
        if (rarity === "Rare") {
            value *= 1.2;
        }
        else if (rarity === "Epic") {
            value *= 1.5;
        }
        else if (rarity === "Legendary") {
            value *= 2;
        }

        // Adds the new loot to the loot array
        loot.push({ name: name, value: value, rarity: rarity});

        // Resets the name, value, and message variables
        lootName.value = "";
        lootValue.value = "";
        messageAdd.innerHTML = "";

        // Updates the webpage with the new loot
        renderLoot();

        // Updates the splitLoot if a partySize is inputted
        if (Number(partySize.value) > 0) {
            splitLoot();
        }
    }

}

function renderLoot() {
    // Description: Updates the webpage with the new loot and the total value of the loot
    // Input: None
    // Output: Populates the lootList with the data in the loot array

    // Initializes Variables
    let output = "";
    let total = 0;

    // Resets the lootList to rebuild it
    lootList.innerHTML = "";

    // Loops for each piece of loot in loot, adding them to the output and adding the value to the total
    for(let i = 0; i < loot.length; i ++) {
        output += `<p>${loot[i].rarity} ${loot[i].name} - $${loot[i].value.toFixed(2)}</p>`;
        total += loot[i].value;
    }

    // Stores the tax and adds an output line for the tax
    let tax = guildTax(total);
    if (tax.taxAmount > 0) {
        output += `<p>Guild Tax(${tax.taxRate*100}%) - $${tax.taxAmount.toFixed(2)}</p>`;
    }

    // Replaces the lootList with the output data
    lootList.innerHTML = output;

    // Replaces the totalLoot with the new total
    totalLoot.innerHTML = `Total Loot: $${tax.finalTotal.toFixed(2)}`;
}

function removeLoot() {
    // Description: Removes loot from the loot array
    // Input: None
    // Output: Removes loot from the loot array

    // Initializes the name of the loot
    let name = lootName.value.trim();

    // Validates that there is a name
    if (name === "") {
        messageAdd.innerHTML = "Please enter a valid name.";
    }
    else {
        // Finds the index of the piece of loot
        let index = loot.findIndex(item => item.name === name);

        // Validates if a valid loot object is found
        if (index === -1) {
            messageAdd.innerHTML = `No loot found of the name "${name}"`;
        }
        else{
            // Removes the loot from the loot array if found and resets the messageAdd
            loot.splice(index, 1);
            messageAdd.innerHTML = "";
            lootName.value = "";

            renderLoot();

            // Updates the splitLoot if a partySize is inputted
            if (Number(partySize.value) > 0 && loot.length > 0) {
                splitLoot();
            }
            else {
                totalLootSplit.innerHTML = "Total Loot: $0.00";
                lootPerMember.innerHTML = "Loot Per Party Member";
                messageSplit.innerHTML = "";
            }
        }
    }
}

function splitLoot() {
    // Description: Splits the loot total value amongst the party
    // Input: None
    // Output: Updates the totalLootSplit and lootPerMember with the new totals

    // Initializes Variables
    let size = Number(partySize.value);

    // Input Validation
    if (loot.length > 0) {
        if (size > 0) {

            // Calculates the total loot value
            let total = 0;
            for(let i = 0; i < loot.length; i ++) {
                total += loot[i].value;
            }

            // Stores the tax and adds an output line for the tax
            let taxTotal = guildTax(total).finalTotal;

            // Resets the messageSplit
            messageSplit.innerHTML = "";

            // Updates the totalLootSplit and lootPerMember based on the new total
            totalLootSplit.innerHTML = `Total Loot: $${taxTotal.toFixed(2)}`;
            lootPerMember.innerHTML = `Loot Per Party Member: $${(taxTotal / size).toFixed(2)}`;
        }
        else { // If the party size is 0 or less, displays an error message
            messageSplit.innerHTML = "Please enter a valid party size.";
        }
    }
    else { // If the loot array has no loot, displays an error message
        messageSplit.innerHTML = "Please enter loot before attempting to split.";
    }
}

function rarityGenerate() {
    // Description: Generates a rarity
    // Input: None
    // Output: Text representing the generated rarity

    // Generates a random number between 0.00 and 1.00
    let roll = Math.random();

    // Determines the rarity based on the roll
    if (roll < 0.7) {
        return "Common";
    }
    else if (roll < 0.9) {
        return "Rare";
    }
    else if (roll < 0.99) {
        return "Epic";
    }
    else {
        return "Legendary";
    }
}

function guildTax(value) {
    // Description: Calculate tax based on the total
    // Input: A number for the value
    // Output: An object containing the tax percentage as a decimal and the resulting total

    // Initializes Variables
    let taxRate = 0;

    // Determines the tax amount
    if (value >= 500) {
        taxRate = 0.3;
    }
    else if (value >= 250) {
        taxRate = 0.2;
    }
    else if (value >= 100) {
        taxRate = 0.1;
    }

    // Calculates the tax values
    let taxAmount = value * taxRate;
    let finalTotal = value - taxAmount;

    return { taxRate:taxRate, taxAmount: taxAmount, finalTotal:finalTotal };
}