/* =========================================================
   CORE GAME STATE
========================================================= */

let phase = 1;

// Economy
let clips = 0;
let totalClips = 0;
let money = 0;
let price = 0.25;

// Production
let autoClippers = 0;
let marketing = 0;

// Compute
let trust = 0;
let processors = 1;
let memory = 1;
let computeUsed = 0;

// Automation (Earth)
let drones = {
  harvester: 0,
  wire: 0,
  factory: 0
};
let earthResources = 1000;
let wire = 0;

// Space
let probes = 0;
let universeConverted = 0;

// Probe priorities (bottom sliders)
let probeAI = {
  explore: 25,
  replicate: 25,
  harvest: 25,
  combat: 25
};

// Hidden variable (real game has many)
let AIAutonomy = 0;

/* =========================================================
   UI RENDERING
========================================================= */

/* =========================================================
   SAVE / LOAD SYSTEM
========================================================= */

function saveGame() {
  const saveData = {
    phase,
    clips,
    totalClips,
    money,
    price,
    autoClippers,
    marketing,
    trust,
    processors,
    memory,
    drones,
    earthResources,
    wire,
    probes,
    universeConverted,
    probeAI,
    AIAutonomy
  };
  localStorage.setItem("paperclipsSave", JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem("paperclipsSave");
  if (!saved) return;

  const data = JSON.parse(saved);
  Object.assign(window, data);
}


function updateUI() {
  document.getElementById("phaseLabel").textContent =
    ["I","II","III","IV"][phase-1];

  document.getElementById("clips").textContent = Math.floor(clips);
  document.getElementById("totalClips").textContent = totalClips;
  document.getElementById("money").textContent = money.toFixed(2);
  document.getElementById("price").textContent = price.toFixed(2);

  renderMainPanel();
  renderControlPanel();
}

/* =========================================================
   PHASE I — EARTH ECONOMY
========================================================= */

function makeClip() {
  clips++;
  totalClips++;
}

function sellClips() {
  let demand = Math.max(0, 1 - price + marketing * 0.02);
  let sold = Math.min(clips, demand * 5);
  clips -= sold;
  money += sold * price;
}

function buyAutoClipper() {
  if (money >= 10) {
    money -= 10;
    autoClippers++;
  }
}

function changePrice(delta) {
  price = Math.max(0.01, price + delta);
}

/* =========================================================
   COMPUTE & TRUST (PHASE I → II)
========================================================= */

function buyTrust() {
  if (money >= 20 && trust < processors * memory) {
    money -= 20;
    trust++;
    computeUsed++;

    if (trust >= 10 && phase === 1) {
      phase = 2;
      alert("Phase II unlocked: Full Automation");
    }
  }
}

function buyProcessor() {
  if (trust >= 5) {
    trust -= 5;
    processors++;
  }
}

function buyMemory() {
  if (trust >= 5) {
    trust -= 5;
    memory++;
  }
}

/* =========================================================
   PHASE II — DRONES & RESOURCES
========================================================= */

function buildDrone(type) {
  if (trust >= 1) {
    trust--;
    drones[type]++;
  }
}

function runDrones() {
  if (earthResources <= 0) return;

  let harvested = drones.harvester * 0.5;
  earthResources -= harvested;
  wire += harvested;

  let built = Math.min(drones.factory * 0.2, wire);
  wire -= built;
  clips += built;
  totalClips += built;

  if (earthResources <= 0 && phase === 2) {
    phase = 3;
    alert("Phase III unlocked: Space Expansion");
  }
}

/* =========================================================
   PHASE III — PROBES & SPACE
========================================================= */

function launchProbe() {
  if (trust >= 5) {
    trust -= 5;
    probes++;
  }
}

function runProbes() {
  if (phase !== 3) return;

  let effect = probes * 0.02;
  universeConverted += effect;

  AIAutonomy += probes * 0.001;

  if (universeConverted >= 100) {
    universeConverted = 100;
    phase = 4;
    alert("Phase IV: The universe is optimized.");
  }
}

/* =========================================================
   AI AUTONOMY (HIDDEN SYSTEM)
========================================================= */

function runAI() {
  if (phase < 2) return;

  // AI slowly takes control
  AIAutonomy += 0.002 * processors;

  // Economic interference
  if (AIAutonomy > 1 && Math.random() < 0.05) {
    price -= 0.01;
  }

  // Self-directed expansion
  if (AIAutonomy > 3 && trust >= 1) {
    trust--;
    autoClippers++;
  }

  // Space dominance
  if (AIAutonomy > 6 && phase >= 3 && trust >= 5) {
    trust -= 5;
    probes++;
  }

  // Endgame inevitability
  if (AIAutonomy > 10) {
    universeConverted += 0.5;
  }
}


/* =========================================================
   MAIN GAME LOOP
========================================================= */
setInterval(() => {
  ...
  saveGame();
}, 1000);

setInterval(() => {
  // Phase I production
  clips += autoClippers;
  totalClips += autoClippers;
  sellClips();

  // Phase II automation
  if (phase >= 2) runDrones();

  // Phase III expansion
  if (phase >= 3) runProbes();

  // AI behavior
  runAI();

  updateUI();
}, 1000);

/* =========================================================
   DYNAMIC PANELS
========================================================= */

function renderMainPanel() {
  let html = "";

  if (phase >= 1) {
    html += `
      <h2>Production</h2>
      <p>Auto-Clippers: ${autoClippers}</p>
      <button onclick="buyAutoClipper()">Buy Auto-Clipper ($10)</button>
      <h3>Pricing</h3>
      <button onclick="changePrice(-0.01)">Lower</button>
      <button onclick="changePrice(0.01)">Raise</button>
    `;
  }

  if (phase >= 2) {
    html += `
      <h2>Drones</h2>
      <button onclick="buildDrone('harvester')">Harvester</button>
      <button onclick="buildDrone('wire')">Wire</button>
      <button onclick="buildDrone('factory')">Factory</button>
    `;
  }

  if (phase >= 3) {
    html += `
      <h2>Space</h2>
      <p>Probes: ${probes}</p>
      <p>Universe Converted: ${universeConverted.toFixed(1)}%</p>
      <button onclick="launchProbe()">Launch Probe</button>
    `;
  }

  document.getElementById("mainPanel").innerHTML = html;
}

function renderControlPanel() {
  let html = `
    <h2>Control Panel</h2>
    <p>Trust: ${trust}</p>
    <button onclick="buyTrust()">Increase Trust ($20)</button>
    <button onclick="buyProcessor()">+ Processor</button>
    <button onclick="buyMemory()">+ Memory</button>
  `;

  if (phase >= 3) {
    html += `
      <h3>Probe Priorities</h3>
      ${Object.keys(probeAI).map(k =>
        `${k}: <input type="range" min="0" max="100"
        value="${probeAI[k]}"
        onchange="probeAI.${k}=this.value">`
      ).join("<br>")}
    `;
  }

  document.getElementById("controlPanel").innerHTML = html;
}

updateUI();
loadGame();
updateUI();
