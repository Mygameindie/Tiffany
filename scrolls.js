
document.addEventListener("DOMContentLoaded", () => {
    const presetScrollBar = document.getElementById("presetScrollBar");
    const categoryScrollBar = document.getElementById("categoryScrollBar");
    const buttonContainer = document.querySelector(".scrollable-buttons");

    
        const presets = [
    { name: "Default", action: applyPreset1 },
    { name: "Remove", action: applyunderwear },
    { name: "Bunny", action: applyBunnyPreset },
    { name: "Soldier", action: applySoldierPreset },
    { name: "Commander", action: applyCommanderPreset }

    ];

   const categories = [
  'bottomunderwear1','bottomunderwear2',
  'topunderwear1','topunderwear2','stocking1',
  'onepiece1',
  'socks1','socks2',
  'boxers1','boxers2',
  'sweatshirt1','sweatshirt2',
  'shoes1','shoes2',
  'pants1','pants2',
  'skirt1','skirt2',
  'top1','top2',
  'dress1','dress2',
  'jacket1','jacket2',
  'bunnysuitbow1','bunnysuitbow2',
  'accessories1','accessories2',
  'hat1','hat2',
  'mask1','mask2',
  'bow1','bow2'
];
   

    function generatePresetButtons() {
        presetScrollBar.innerHTML = "";
        presets.forEach(preset => {
            const presetButton = document.createElement("button");
            presetButton.textContent = preset.name;
            presetButton.classList.add("preset-button");
            presetButton.onclick = preset.action;
            presetScrollBar.appendChild(presetButton);
        });
    }

    function generateCategoryButtons() {
        categoryScrollBar.innerHTML = "";
        categories.forEach(cat => {
            const tab = document.createElement("button");
            tab.textContent = cat;
            tab.classList.add("preset-button");
            tab.onclick = () => showCategoryButtons(cat);
            categoryScrollBar.appendChild(tab);
        });
    }

    function showCategoryButtons(categoryName) {
        buttonContainer.innerHTML = "";

        const items = document.querySelectorAll(`img.${categoryName}`);
        items.forEach(item => {
            const buttonWrap = document.createElement('div');
            buttonWrap.classList.add('button-wrap');

            const button = document.createElement("img");
            button.src = item.src.replace(".png", "b.png");
            button.classList.add("item-button");
            button.onclick = () => toggleVisibility(item.id, categoryName);
            buttonWrap.appendChild(button);

            const colorButton = document.createElement("button");
            colorButton.textContent = "🎨";
            colorButton.classList.add("color-change-button");
            colorButton.onclick = (e) => {
                e.stopPropagation();
                if (item.style.visibility === "hidden") toggleVisibility(item.id, categoryName);
                showColorPicker(item.id);
            };
            buttonWrap.appendChild(colorButton);

            buttonContainer.appendChild(buttonWrap);
        });
    }

    generatePresetButtons();
    generateCategoryButtons();

    // Scroll behavior for each bar
    [presetScrollBar, categoryScrollBar].forEach(scrollEl => {
        scrollEl.addEventListener("wheel", (evt) => {
            if (evt.deltaY !== 0) {
                evt.preventDefault();
                scrollEl.scrollLeft += evt.deltaY;
            }
        }, { passive: false });
    });
});
function enableDragScroll(scrollElement) {
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollElement.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollElement.classList.add('dragging');
        startX = e.pageX - scrollElement.offsetLeft;
        scrollLeft = scrollElement.scrollLeft;
    });

    scrollElement.addEventListener('mouseleave', () => {
        isDown = false;
        scrollElement.classList.remove('dragging');
    });

    scrollElement.addEventListener('mouseup', () => {
        isDown = false;
        scrollElement.classList.remove('dragging');
    });

    scrollElement.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollElement.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed
        scrollElement.scrollLeft = scrollLeft - walk;
    });
}

// Enable drag scrolling on load
document.addEventListener("DOMContentLoaded", () => {
    const presetScroll = document.getElementById("presetScrollBar");
    const categoryScroll = document.getElementById("categoryScrollBar");

    if (presetScroll) enableDragScroll(presetScroll);
    if (categoryScroll) enableDragScroll(categoryScroll);
});