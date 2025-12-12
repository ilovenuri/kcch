/* =================================================
   CENTER PANEL CONFIG
================================================= */
const CENTER_CONFIG = {
  rotation: {
    scenes: [
      { type: "image", durationMs: 13500 },
      { type: "news", durationMs: 18000 },
      { type: "weather", durationMs: 13500 },
      { type: "promo", durationMs: 13500 }
    ]
  },
  tickerSpeedPxPerSec: 110,
  data: {
    image: [
      { src: "https://i.imgur.com/UW4WgXh.png", alt: "image announcement" }
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
        text: "주일 첫 시간을 하나님께 올려드리는 할렐루야 성가대 대원을 모집합니다. 안수집사와 장로로 구성되어 주일 1부 예배를 섬기는 할렐루야 성가대에 많은 관심과 지원을 부탁드립니다"
      },
      { icon: "📢", text: "식당봉사부 봉사자를 찾습니다. 많은 관심 부탁드립니다." },
      { icon: "📢", text: "식후 식탁, 의자 깨끗하게 정리정돈 부탁드립니다. 감사합니다." }
    ]
  }
};

/* =================================================
   RIGHT PANEL CONFIG
================================================= */
const RIGHT_SCENES = [
  { type: "clock", durationMs: 6000 },
  {
    type: "text",
    text: "항상 기뻐하라<br>쉬지말고 기도하라<br>범사에 감사하라<br>(살전 5:16–18)",
    durationMs: 6000
  },
  {
    type: "text",
    text: "북한선교헌금<br>61,954,424원<br>(2025년 9월말 기준)",
    durationMs: 6000
  }
];

/* =================================================
   STATE
================================================= */
let centerSceneIndex = 0;
const centerItemIndex = { image: 0, news: 0, weather: 0, promo: 0 };

let rightSceneIndex = 0;

const centerRoot = document.getElementById("sceneRoot");
const rightRoot = document.getElementById("rightSceneRoot");

/* =================================================
   UTILS
================================================= */
function getTime() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") + ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

/* =================================================
   TICKER (즉시 시작, 길이 기반 속도)
================================================= */
function applyTicker(el) {
  const mask = el.closest(".ticker-mask");
  if (!mask) return;

  const textWidth = el.scrollWidth;
  const maskWidth = mask.clientWidth;
  const distance = Math.max(textWidth - maskWidth, 0);

  if (distance <= 0) return;

  const durationSec = distance / CENTER_CONFIG.tickerSpeedPxPerSec;

  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${distance}px)` }
    ],
    {
      duration: durationSec * 1000,
      easing: "linear",
      fill: "forwards"
    }
  );
}

/* =================================================
   CENTER RENDER
================================================= */
function renderCenter(type, data) {
  if (type === "image") {
    return `<img src="${data.src}" alt="${data.alt || ""}">`;
  }

  if (type === "news" || type === "promo") {
    return `
      <span class="icon">${data.icon}</span>
      <div class="ticker-mask">
        <div class="ticker-move">${data.text}</div>
      </div>
    `;
  }

  return `
    <span class="icon">${data.icon}</span>
    <span>${data.text}</span>
  `;
}

/* =================================================
   CENTER TRANSITION
================================================= */
function transitionCenter(type, data) {
  const oldScene = centerRoot.querySelector(".scene");
  const newScene = document.createElement("div");

  newScene.className = type === "image" ? "scene image" : "scene text";
  newScene.innerHTML = renderCenter(type, data);
  centerRoot.appendChild(newScene);

  requestAnimationFrame(() => {
    newScene.classList.add("fade-in");
    const ticker = newScene.querySelector(".ticker-move");
    if (ticker) applyTicker(ticker);
  });

  if (oldScene) {
    oldScene.classList.remove("fade-in");
    oldScene.classList.add("fade-out");
    setTimeout(() => oldScene.remove(), 600);
  }
}

/* =================================================
   CENTER LOOP
================================================= */
function playCenter() {
  const def = CENTER_CONFIG.rotation.scenes[centerSceneIndex];
  const type = def.type;
  const items = CENTER_CONFIG.data[type];
  const idx = centerItemIndex[type];

  transitionCenter(type, items[idx]);

  centerItemIndex[type]++;

  if (centerItemIndex[type] >= items.length) {
    centerItemIndex[type] = 0;
    centerSceneIndex = (centerSceneIndex + 1) % CENTER_CONFIG.rotation.scenes.length;
  }

  setTimeout(playCenter, def.durationMs);
}

/* =================================================
   RIGHT TRANSITION
================================================= */
function transitionRight(scene) {
  const old = rightRoot.querySelector(".right-scene");
  const next = document.createElement("div");

  next.className = "right-scene";

  if (scene.type === "clock") {
    next.innerHTML = `<div class="right-clock">${getTime()}</div>`;
  } else {
    next.innerHTML = `<div class="right-text">${scene.text}</div>`;
  }

  rightRoot.appendChild(next);

  requestAnimationFrame(() => {
    next.classList.add("fade-in");
  });

  if (old) {
    old.classList.remove("fade-in");
    old.classList.add("fade-out");
    setTimeout(() => old.remove(), 600);
  }
}

/* =================================================
   RIGHT LOOP
================================================= */
function playRight() {
  const scene = RIGHT_SCENES[rightSceneIndex];
  transitionRight(scene);

  rightSceneIndex = (rightSceneIndex + 1) % RIGHT_SCENES.length;
  setTimeout(playRight, scene.durationMs);
}

/* =================================================
   BOOT
================================================= */
function boot() {
  playCenter();
  playRight();

  // live clock update
  setInterval(() => {
    const clock = rightRoot.querySelector(".right-clock");
    if (clock) clock.textContent = getTime();
  }, 1000);
}

boot();
