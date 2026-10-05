const state = {
  brand: "",
  model: "",
  ram: "",
  storage: "",
  density: 0
};

const $ = (id) => document.getElementById(id);

function goTo(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function init() {
  $("brandGrid").innerHTML = Object.keys(PHONE_DATA)
    .map(
      (brand) => `
        <button class="brand" onclick="selectBrand('${brand}', this)">
          ${brand}
          <small>${PHONE_DATA[brand].length} models</small>
        </button>
      `
    )
    .join("");
}

function selectBrand(brand, element) {
  state.brand = brand;
  state.model = "";

  $("brandNext").disabled = false;

  document.querySelectorAll(".brand").forEach((item) => {
    item.classList.remove("selected");
  });

  element.classList.add("selected");
}

function openModelStep() {
  $("modelSelect").innerHTML =
    '<option value="">Select model</option>' +
    PHONE_DATA[state.brand]
      .map((model) => `<option>${model}</option>`)
      .join("");

  $("ramSelect").value = "";
  $("storageSelect").value = "";

  state.model = "";
  state.ram = "";
  state.storage = "";
  state.density = 0;

  $("densityText").textContent = "Not scanned yet";
  $("modelNext").disabled = true;

  goTo("model");
}

function scanDensity() {
  const dpr = window.devicePixelRatio || 1;

  const ppi = Math.round(160 * dpr);

  const width = window.screen.width * dpr;
  const height = window.screen.height * dpr;

  state.density = ppi;

  $("densityText").textContent =
    `Detected • ${Math.round(width)} × ${Math.round(height)} • ~${ppi} PPI`;

  updateModelNext();
}

function updateModelNext() {
  $("modelNext").disabled = !(
    state.model &&
    state.ram &&
    state.storage &&
    state.density
  );
}

function numRam() {
  return parseInt(state.ram) || 4;
}

function showResult() {
  const ram = numRam();
  const ppi = state.density || 320;

  const boost = Math.min(
    5,
    Math.max(
      0,
      Math.round((ram - 4) / 4)
    )
  );

  const base = Math.min(
    100,
    Math.round(88 + (ppi - 280) / 60) + boost
  );

  const settings = [
    ["General", Math.min(100, base + 5)],
    ["Red Dot", Math.min(100, base + 1)],
    ["2X Scope", Math.max(70, base - 4)],
    ["4X Scope", Math.max(65, base - 10)],
    ["Sniper Scope", Math.max(40, base - 32)],
    ["Free Look", Math.max(65, base - 7)]
  ];

  $("resultPhone").textContent =
    `${state.brand} ${state.model}`;

  $("resultRam").textContent =
    state.ram;

  $("resultStorage").textContent =
    state.storage;

  $("resultDensity").textContent =
    `~${ppi} PPI`;

  $("settingsGrid").innerHTML =
    settings
      .map(
        ([name, value]) => `
          <div class="setting">
            <small>${name}</small>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");

  $("fireButton").textContent =
    `${Math.max(
      42,
      Math.min(
        55,
        Math.round(47 + ram / 8)
      )
    )}%`;

  $("dpi").textContent =
    Math.max(
      320,
      Math.min(
        560,
        Math.round(ppi * 1.25)
      )
    );

  goTo("result");
}

init();
