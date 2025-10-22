// Common hidden categories (all items to hide by default in presets)
const commonHiddenCategories = [
'bottomunderwear1', 'bottomunderwear2', 'bottomunderwear3',
'topunderwear1', 'topunderwear2', 'topunderwear3',
'onepiece1', 'onepiece3',
'socks1', 'socks2', 'socks3', 'stocking1', 'stocking3',
'boxers1', 'boxers2', 'boxers3',
'sweatshirt1', 'sweatshirt2', 'sweatshirt3',
'shoes1', 'shoes2', 'shoes3',
'pants1', 'pants2', 'pants3',
'skirt1', 'skirt2', 'skirt3',
'top1', 'top2', 'top3',
'dress1', 'dress2', 'dress3',
'jacket1', 'jacket2', 'jacket3', 'dress1w',
'bunnysuitbow1', 'bunnysuitbow2', 'bunnysuitbow3',
'dress2w',
'dress3w',
'skirt1w',
'skirt2w',
'skirt3w',
'accessories1', 'accessories2', 'accessories3',
'hat1', 'hat2', 'hat3',
'mask1', 'mask2', 'mask3',
'bow1', 'bow2', 'bow3','mermaid1','outsidebra1','bodyjacket1'
];

function applyPreset1() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Show top
    showItem("bodyjacket1_1.png", "bodyjacket1");

    // Show pants
    showItem("pants1_1.png", "pants1");

    // Show shoes
    showItem("shoes1_1.png", "shoes1");

    // Show bottom underwear
    showItem("bottomunderwear1_1.png", "bottomunderwear1");

    // Show top underwear
    showItem("topunderwear1_1.png", "topunderwear1");
}

function applyunderwear() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Show underwear tops
    showItem("topunderwear1_1.png", "topunderwear1");
	
    // Show all bottom underwear
    showItem("bottomunderwear1_1.png", "bottomunderwear1");
    
}

function applyBunnyPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Bunny preset items
    showItem("bunnysuitbow1_1.png", "bunnysuitbow1");

    showItem("hat1_1.png", "hat1");
    showItem("onepiece1_1.png", "onepiece1");
    showItem("shoes1_2.png", "shoes1");
    showItem("stocking1_1.png", "stocking1");
}

function applySoldierPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Soldier preset items
    showItem("shoes1_3.png", "shoes1");
    showItem("dress1_1.png", "dress1");
	// Show underwear tops
    showItem("topunderwear1_1.png", "topunderwear1");
	
    // Show all bottom underwear
    showItem("bottomunderwear1_1.png", "bottomunderwear1");
}

function applyCommanderPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Commander preset items
    showItem("bodyjacket1_2.png", "bodyjacket1");
    showItem("bottomunderwear1_2.png", "bottomunderwear1");
	showItem("shoes1_3.png", "shoes1");
	
}
function applyMermaidPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Mermaid preset items
    showItem("mermaid1_1.png", "mermaid1");
    showItem("topunderwear1_3.png", "topunderwear1");
}
function applyBeachPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // Beach preset items
    showItem("topunderwear1_2.png", "topunderwear1");
    showItem("bottomunderwear1_3.png", "bottomunderwear1");
}
function applyVPreset() {
    // Hide all clothing items first
    hideSpecificCategories(commonHiddenCategories);

    // V preset item
    showItem("onepiece1_2.png", "onepiece1");
}
// ✅ Shared showItem function for consistent item display
function showItem(itemId, categoryName) {
    const selectedItem = document.getElementById(itemId);
    if (selectedItem) {
        selectedItem.style.visibility = "visible";       // Force visibility
        selectedItem.style.display = "block";            // Ensure it's not hidden
        selectedItem.style.position = "absolute";        // Keep absolute positioning
        selectedItem.style.left = "0";                   // Align left
        selectedItem.style.top = "0";                    // Align top
        selectedItem.style.zIndex = getZIndex(categoryName); // Correct layering
    } else {
        console.warn(`Item not found: ${itemId} in category ${categoryName}`);
    }
}