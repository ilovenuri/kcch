/* ================================
   SCALE (가로 기준)
================================ */
function fitToScreen() {
  const scale = window.innerWidth / 1920;
  document.querySelector(".scale-wrapper").style.transform =
    `scale(${scale})`;
}
window.addEventListener("resize", fitToScreen);

/* ================================
   CONFIG
================================ */
const CENTER_CONFIG = {
  tickerSpeedPxPerSec: 110,
  rotation: [
    { type: "image_perm", duration: 13500 },
    { type: "news", duration: 18000 },
    { type: "promo", duration: 13500 },
    { type: "image_temp", duration: 13500 }
  ],
  data: {
    image_perm: [
      { src: "https://i.imgur.com/UW4WgXh.png" }
    ],
    image_temp: [
      { src: "https://i.imgur.com/s94GpXs.png", bgColor: "#317b61" }
    ],
    news: [
      { icon: "⛪", text: "오늘 설교 말씀: 거짓 빛은 사라지고, 참 빛이 오신다 (출22:18)" }
    ],
    promo: [
      { icon: "🍜", text: "점심식사 섬김이: 용화식 안수집사, 김옥경 권사 가정" }
    ]
  }
};

const RIGHT_SCENES = [
  { type: "clock", duration: 6000 },
  {
    type: "text",
    text: "항상 기뻐하라<br>쉬지말고 기도하라<br>범사에 감사하라<br>(살전 5:16–18)",
    duration: 6000
  },
  {
    type: "text",
    text: "북한선교헌금<br>61,954,424원<br>(2025년 9월말 기준)",
    duration: 6000
  }
];

/* ================================
   STATE
================================ */
let sceneIndex = 0;
let itemIndex = 0;
let rightIndex = 0;

const appEl = document.querySelector(".app");
const centerRoot = document.getElementById("sceneRoot");
const rightRoot = document.getElementById("rightSceneRoot");

/* ================================
   UTIL
================================ */
function getTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ================================
   TICKER
================================ */
function startTicker(el) {
  const mask = el.closest(".ticker-mask");
  const dist = el.scrollWidth - mask.clientWidth;
  if (dist <= 0) return;

  const duration = (dist / CENTER_CONFIG.tickerSpeedPxPerSec) * 1000;
  el.animate(
    [{ transform: "translateX(0)" }, { transform: `translateX(-${dist}px)` }],
    { duration, easing: "linear", fill: "forwards" }
  );
}

/* ================================
   RENDER CENTER
================================ */
function renderCenter(type, data) {
  if (type === "image_perm" || type === "image_temp") {
    return `<img src="${data.src}">`;
  }

  return `
    <span class="icon">${data.icon}</span>
    <div class="ticker-mask">
      <div class="ticker-move">${data.text}</div>
    </div>
  `;
}

/* ================================
   CENTER LOOP
================================ */
function showCenter() {
  const scene = CENTER_CONFIG.rotation[sceneIndex];
  const items = CENTER_CONFIG.data[scene.type];
  const data = items[itemIndex];

  appEl.style.backgroundColor =
    scene.type === "image_temp" && data.bgColor ? data.bgColor : "#ffffff";

  const old = centerRoot.querySelector(".scene");
  const next = document.createElement("div");

  next.className =
    scene.type === "image_perm"
      ? "scene image-perm"
      : scene.type === "image_temp"
      ? "scene image-temp"
      : "scene text";

  next.innerHTML = renderCenter(scene.type, data);
  centerRoot.appendChild(next);

  requestAnimationFrame(() => {
    next.classList.add("fade-in");
    const ticker = next.querySelector(".ticker-move");
    if (ticker) startTicker(ticker);
  });

  if (old) {
    old.classList.add("fade-out");
    setTimeout(() => old.remove(), 600);
  }

  itemIndex++;
  if (itemIndex >= items.length) {
    itemIndex = 0;
    sceneIndex = (sceneIndex + 1) % CENTER_CONFIG.rotation.length;
  }

  setTimeout(showCenter, scene.duration);
}

/* ================================
   RIGHT LOOP
================================ */
function showRight() {
  const scene = RIGHT_SCENES[rightIndex];

  const old = rightRoot.querySelector(".right-scene");
  const next = document.createElement("div");
  next.className = "right-scene";

  next.innerHTML =
    scene.type === "clock"
      ? `<div class="right-clock">${getTime()}</div>`
      : `<div class="right-text">${scene.text}</div>`;

  rightRoot.appendChild(next);
  requestAnimationFrame(() => next.classList.add("fade-in"));

  if (old) {
    old.classList.add("fade-out");
    setTimeout(() => old.remove(), 600);
  }

  rightIndex = (rightIndex + 1) % RIGHT_SCENES.length;
  setTimeout(showRight, scene.duration);
}

/* ================================
   BOOT
================================ */
function boot() {
  fitToScreen();
  showCenter();
  showRight();

  setInterval(() => {
    const clock = rightRoot.querySelector(".right-clock");
    if (clock) clock.textContent = getTime();
  }, 1000);
}

boot();
