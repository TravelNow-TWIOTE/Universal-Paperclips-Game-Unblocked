let clips = 0;
let money = 0;
let price = 0.25;
let autoClippers = 0;

function updateUI() {
  document.getElementById("clips").textContent = Math.floor(clips);
  document.getElementById("money").textContent = money.toFixed(2);
  document.getElementById("price").textContent = price.toFixed(2);
  document.getElementById("autoClippers").textContent = autoClippers;
}

function makeClip() {
  clips++;
  sellClips();
  updateUI();
}

function sellClips() {
  let demand = Math.max(0, 1 - price);
  let sold = Math.min(clips, demand * 2);
  clips -= sold;
  money += sold * price;
}

function buyAutoClipper() {
  if (money >= 10) {
    money -= 10;
    autoClippers++;
    updateUI();
  }
}

function changePrice(amount) {
  price = Math.max(0.01, price + amount);
  updateUI();
}

setInterval(() => {
  clips += autoClippers;
  sellClips();
  updateUI();
}, 1000);

updateUI();
