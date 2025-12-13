/* ================================
   SCALE TO FIT
================================ */
function fitToScreen() {
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 128;
  const scale = Math.min(scaleX, scaleY);
  document.querySelector(".app").style.transform = `scale(${scale})`;
}
window.addEventListener("resize", fitToScreen);

/* ================================
   CENTER CONFIG
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
      {
        src: "https://i.imgur.com/s94GpXs.png",
        bgColor: "#317b61"
      }
    ],
    news: [
      { icon: "⛪", text: "오늘 설교 말씀: 거짓 빛은 사라지고, 참 빛이 오신다 (출22:18)" }
    ],
    promo: [
      { icon: "🍜", text: "오늘 2교구 식당봉사입니다." },
      {
        icon: "🍜",
        text: "점심식사 섬김이: 용화식 안수집사, 김옥경 권사 (용수정, 용환웅) 가정 | 박장우 장로, 최현숙 권사 가정"
      },
      { icon: "💐", text: "강단 꽃꽂이 섬김이: 강성환 안수집사, 김희자 권사 가정" },
      {
        icon: "🎶",
        text: "주일 첫 시간을 하나님께 올려드리는 할렐루야 성가대 대원을 모집합니다."
      },
      { icon: "📢", text: "식당봉사부 봉사자를 찾습니다." },
      { icon: "📢", text: "식후 식탁, 의자 정리 부탁드립니다." }
    ]
  }
};

/* ================================
   RIGHT PANEL CONFIG
================================ */
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
let rightSceneIndex = 0;

const centerRoot = document.getElementById("sceneRoot");
const rightRoot = document.getElementById("rightSceneRoot");
const appEl = document.querySelector(".app");

/* ================================
   UTIL
================================ */
function getTime() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") + ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

/* ================================
   TICKER
================================ */
function startTicker(el) {
  const mask = el.closest(".ticker-mask");
  const distance = el.scrollWidth - mask.clientWidth;
  if (distance <= 0) return;

  const duration = (distance / CENTER_CONFIG.tickerSpeedPxPerSec) * 1000;
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${distance}px)` }
    ],
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
   CENTER LOOP (🔥 전체 배경 처리)
================================ */
function showCenter() {
  const scene = CENTER_CONFIG.rotation[sceneIndex];
  const items = CENTER_CONFIG.data[scene.type];
  const data = items[itemIndex];

  /* 🔥 전체 배경색 제어 */
  if (scene.type === "image_temp" && data.bgColor) {
    appEl.style.backgroundColor = data.bgColor;
  } else {
    appEl.style.backgroundColor = "#ffffff";
  }

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
   RIGHT PANEL LOOP
================================ */
function showRight() {
  const scene = RIGHT_SCENES[rightSceneIndex];

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

  rightSceneIndex = (rightSceneIndex + 1) % RIGHT_SCENES.length;
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
