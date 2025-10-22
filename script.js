/* ===========================================================
   BASE ITEM SETUP + Z-INDEX MAP
   =========================================================== */
const jsonFiles = [
  'face1.json', 'backitems1.json', 'bottomunderwear1.json', 'topunderwear1.json',
  'stocking1.json', 'onepiece1.json', 'socks1.json', 'boxers1.json',
  'sweatshirt1.json', 'shoes1.json', 'pants1.json', 'skirt1.json',
  'top1.json', 'dress1.json', 'bodyjacket1.json', 'jacket1.json',
  'dress1w.json', 'outsidebra1.json', 'bunnysuitbow1.json', 'skirt1w.json',
  'accessories1.json', 'hat1.json', 'mask1.json', 'bow1.json', 'mermaid1.json'
];

/* ===========================================================
   Z-INDEX MAP
   =========================================================== */
function getZIndex(categoryName) {
  const base = String(categoryName).replace(/\d+w?$/, '');
  const zIndexMap = {
    backitems: 9,
    face: 11,
    stocking: 30, bottomunderwear: 40, topunderwear: 50,
    onepiece: 60, socks: 70, boxers: 80, sweatshirt: 90,
    shoes: 100, pants: 110, skirt: 120, top: 130,
    dress: 140, outsidebra: 141, bunnysuitbow: 141,
    jacket: 150, bodyjacket: 151,
    accessories: 160, hat: 170, mask: 180, bow: 190,
    mermaid: 200
  };
  return zIndexMap[base] || 0;
}

/* ===========================================================
   HELPERS
   =========================================================== */
async function loadItemFile(file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Error loading file: ${file}`);
    return await res.json();
  } catch (e) {
    console.error(`Failed to load ${file}:`, e);
    return [];
  }
}

function hideSpecificCategories(categories) {
  categories.forEach(cat =>
    document.querySelectorAll(`.${cat}`).forEach(el => (el.style.visibility = 'hidden'))
  );
}

function baseName(cat){ return String(cat).replace(/\d+w?$/,''); }
function isWindCategory(cat){ return /w$/.test(cat); }

/* ===========================================================
   TOGGLE VISIBILITY SYSTEM — full exclusivity rules
   =========================================================== */
function toggleVisibility(itemId, categoryName) {
  document.querySelectorAll(`.${categoryName}`).forEach(item => {
    if (item.id !== itemId) item.style.visibility = 'hidden';
  });

  const selected = document.getElementById(itemId);
  if (!selected) return;

  selected.style.visibility =
    selected.style.visibility === 'visible' ? 'hidden' : 'visible';

  if (selected.style.visibility === 'visible') {
    // Base exclusivity definitions (one-way)
    const baseMap = {
      onepiece1:     ['topunderwear1', 'bottomunderwear1', 'outsidebra1'],
      dress1:        ['top1', 'pants1', 'skirt1', 'sweatshirt1', 'bunnysuitbow1', 'outsidebra1'],
      skirt1:        ['pants1'],
      pants1:        ['skirt1'],
      socks1:        ['stocking1'],
      stocking1:     ['socks1'],
      mermaid1:      ['pants1', 'skirt1', 'socks1', 'shoes1', 'stocking1'],
      outsidebra1:   ['top1', 'dress1', 'sweatshirt1', 'topunderwear1', 'onepiece1'],
      bodyjacket1:   ['outsidebra1', 'top1', 'dress1', 'sweatshirt1', 'jacket1'],
      bunnysuitbow1: ['dress1', 'jacket1'],
      jacket1:       ['bunnysuitbow1']
    };

    // Auto-generate reverse mappings so exclusivity is mutual
    const map = structuredClone(baseMap);
    for (const [key, targets] of Object.entries(baseMap)) {
      targets.forEach(t => {
        if (!map[t]) map[t] = [];
        if (!map[t].includes(key)) map[t].push(key);
      });
    }

    // Apply bidirectional exclusivity
    if (map[categoryName]) hideSpecificCategories(map[categoryName]);

    // Generic guards for wind variants
    if (baseName(categoryName)==='dress') hideSpecificCategories(['dress1w']);
    if (baseName(categoryName)==='skirt') hideSpecificCategories(['skirt1w']);
  }
}

/* ===========================================================
   LOAD ITEMS IN BATCHES (build layers + UI panels)
   =========================================================== */
async function loadItemsInBatches(batchSize = 5, delay = 50) {
  const base = document.querySelector('.base-container');
  const ctrl = document.querySelector('.controls');
  if (!base) return;

  for (let i = 0; i < jsonFiles.length; i += batchSize) {
    const batch = jsonFiles.slice(i, i + batchSize);
    await Promise.all(batch.map(async f => {
      const data = await loadItemFile(f);
      const cat = f.replace('.json', '');
      const frag = document.createDocumentFragment();

      data.forEach(item => {
        const id = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.id = id;
        img.src = item.src;
        img.alt = item.alt || id;
        img.className = `clothing-layer ${cat}`;
        img.style.position = 'absolute';
        img.style.zIndex = getZIndex(cat);
        img.style.visibility = item.visibility === 'visible' ? 'visible' : 'hidden';
        frag.appendChild(img);

        // === Control Buttons (UI) ===
        if (ctrl && !isWindCategory(cat)) {
          let panel = document.getElementById(`panel-${cat}`);
          if (!panel) {
            panel = document.createElement('div');
            panel.id = `panel-${cat}`;
            const title = document.createElement('h3');
            title.textContent = cat;
            title.style.margin = '6px 0';
            title.style.fontSize = '14px';
            panel.appendChild(title);
            ctrl.appendChild(panel);
          }

          const wrap = document.createElement('div');
          wrap.className = 'button-wrap';

          const btn = document.createElement('img');
          btn.src = item.src.replace('.png', 'b.png');
          btn.alt = (item.alt || '') + ' Button';
          btn.className = 'item-button';
          btn.style.userSelect = 'none';
          btn.onclick = () => toggleVisibility(id, cat);

          wrap.appendChild(btn);
          panel.appendChild(wrap);
        }
      });

      base.appendChild(frag);
    }));
    await new Promise(r => setTimeout(r, delay));
  }

  const loadScreen = document.getElementById('loading-screen');
  if (loadScreen) loadScreen.style.display = 'none';
}

/* ===========================================================
   GAME ENTRY + WIND EFFECT (press/hold)
   =========================================================== */
function enterGame() {
  const mm = document.querySelector('.main-menu');
  const gc = document.querySelector('.game-container');
  if (mm) mm.style.display = 'none';
  if (gc) gc.style.display = 'block';
}

function applyWindEffect() {
  ['skirt1', 'dress1'].forEach(prefix => {
    for (let i = 1; i <= 10; i++) {
      const n = document.getElementById(`${prefix}_${i}.png`);
      const w = document.getElementById(`${prefix}_${i}w.png`);
      if (n && w && n.style.visibility === 'visible') {
        n.style.visibility = 'hidden';
        w.style.visibility = 'visible';
      }
    }
  });
}

function removeWindEffect() {
  ['skirt1', 'dress1'].forEach(prefix => {
    for (let i = 1; i <= 10; i++) {
      const n = document.getElementById(`${prefix}_${i}.png`);
      const w = document.getElementById(`${prefix}_${i}w.png`);
      if (w && n && w.style.visibility === 'visible') {
        w.style.visibility = 'hidden';
        n.style.visibility = 'visible';
      }
    }
  });
}

/* ===========================================================
   BASE FACE LAYER HANDLER
   =========================================================== */
(() => {
  function hideFaces() {
    document.querySelectorAll('.face1,.face2').forEach(e => e.style.visibility = 'hidden');
  }
  function showFaceGroup(cls) {
    hideFaces();
    document.querySelectorAll('.' + cls).forEach(e => e.style.visibility = 'visible');
  }
  window.changeToBase2 = () => showFaceGroup('face2');
  window.changeToBase3 = () => showFaceGroup('face2');
  window.resetToBase1  = () => hideFaces();
})();

/* ===========================================================
   BACKGROUND CYCLER
   =========================================================== */
(() => {
  const bg  = document.getElementById('base-bg');
  const btn = document.getElementById('change-bg-btn');
  if (!btn || !bg) return;

  let idx = 1;
  const total = 10;

  btn.addEventListener('click', () => {
    idx = (idx % total) + 1;
    bg.style.backgroundImage = `url('background${idx}.png')`;
  });
})();

/* ===========================================================
   INIT
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button,img').forEach(el => {
    el.style.outline = 'none';
    el.style.userSelect = 'none';
    el.style.webkitTapHighlightColor = 'transparent';
  });

  const windBtn = document.getElementById('wind-button');
  if (windBtn) {
    ['mousedown', 'touchstart'].forEach(e =>
      windBtn.addEventListener(e, applyWindEffect, { passive: false })
    );
    ['mouseup', 'mouseleave', 'touchend'].forEach(e =>
      windBtn.addEventListener(e, removeWindEffect, { passive: false })
    );
  }
});

window.addEventListener('load', () => {
  loadItemsInBatches();
});

/* Reinforce iOS Tap-Highlight Removal */
document.addEventListener('DOMContentLoaded', () => {
  const disableTapHighlight = el => {
    el.style.webkitTapHighlightColor = 'transparent';
    el.style.webkitTouchCallout = 'none';
    el.style.webkitUserSelect = 'none';
    el.style.userSelect = 'none';
    el.style.outline = 'none';
  };

  const applyAll = () => {
    document.querySelectorAll('button, img, .item-button, .small-button').forEach(disableTapHighlight);
  };
  applyAll();

  const observer = new MutationObserver(applyAll);
  observer.observe(document.body, { childList: true, subtree: true });
});