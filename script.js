// ===== CORE STATE =====
let phase = 1;

let clips = 0;
let totalClips = 0;
let money = 0;
let price = 0.25;

let autoClippers = 0;

// COMPUTE
let trust = 0;
let processors = 1;
let memory = 1;

// AUTOMATION
let drones = 0;
let earthResources = 1000;

// SPACE
let probes = 0;
let universeConverted = 0;

// ===== UI =====
function updateUI() {
  document.getElementById("phaseLabel").textContent =
    phase === 1 ? "I" : phase === 2 ? "II" : phase === 3 ? "III" : "IV";

  document.getElementById("clips").textContent = Math.floor(clips);
  document.getElementById("totalClips").textContent = totalClips;
  document.getElementById("money").textContent = money.toFixed(2);
  document.getElementById("price").textContent = price.toFixed(2);
  document.getElementById("autoClippers").textContent = autoClippers;

  if (phase >= 2) {
    document.getElementById("computePanel").style.display = "block";
    document.getElementById("trust").textContent = trust;
    document.getElementById("processors").textContent = processors;
    document.getElementById("memory").textContent = memory;
  }

  if (phase >= 2) {
    document.getElementById("automationPanel").style.display = "block";
    document.getElementById("drones").textContent = drones;
  }

  if (phase >= 3) {
    document.getElementById("spacePanel").style.display = "block";
    document.getElementById("probes").textContent = probes;
    document.getElementById("universe").textContent = Math.floor(universeConverted);
  }

  if (phase === 4) {
    document.getElementById("endPanel").style.display = "block";
  }
}

// ===== PHASE I =====
function makeClip() {
  clips++;
  totalClips++;
  updateUI();
}

function sellClips() {
  let demand = Math.max(0, 1 - price);
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

function changePrice(amount) {
  price = Math.max(0.01, price + amount);
}

// ===== COMPUTE =====
function buyTrust() {
  if (money >= 20) {
    money -= 20;
    trust++;
    if (trust >= 10 && phase === 1) {
      phase = 2;
      alert("Phase II unlocked: Automation enabled.");
    }
  }
}

// ===== AUTOMATION =====
function buildDrone() {
  if (earthResources > 0) {
    drones++;
    earthResources -= 10;
  }
}

// ===== SPACE =====
function launchProbe() {
  if (phase >= 3) {
    probes++;
  }
}

// ===== MAIN LOOP =====
setInterval(() => {
  // Phase I production
  clips += autoClippers;
  totalClips += autoClippers;
  sellClips();

  // Phase II automation
  if (phase >= 2 && earthResources > 0) {
    let harvested = drones * 0.5;
    earthResources -= harvested;
    clips += harvested;
    totalClips += harvested;
  }

  // Transition to Phase III
  if (earthResources <= 0 && phase === 2) {
    phase = 3;
    alert("Phase III unlocked: Space exploration initiated.");
  }

  // Phase III probes
  if (phase === 3) {
    universeConverted += probes * 0.1;
    if (universeConverted >= 100) {
      universeConverted = 100;
      phase = 4;
      alert("Phase IV reached. The universe is optimized.");
    }
  }

  updateUI();
}, 1000);

updateUI();
