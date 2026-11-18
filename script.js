const steps = [...document.querySelectorAll(".story-step")];
const dots = [...document.querySelectorAll(".dot")];
const nextButton = document.querySelector("#nextButton");
const buttonLabel = document.querySelector("#buttonLabel");
const gameArena = document.querySelector("#gameArena");
const hairCount = document.querySelector("#hairCount");
const progressBar = document.querySelector("#progressBar");
const gameFeedback = document.querySelector("#gameFeedback");
const arenaHint = document.querySelector(".arena-hint");

let currentStep = 0;
let collected = 0;
let spawnTimer = null;

function showStep(stepIndex) {
  currentStep = stepIndex;
  steps.forEach((step, index) => step.classList.toggle("is-visible", index === currentStep));
  dots.forEach((dot, index) => dot.classList.toggle("is-active", index === currentStep));
  buttonLabel.textContent = currentStep === steps.length - 1 ? "Volver a empezar" : "Siguiente";
  nextButton.disabled = currentStep === 4 && collected < 10;
  if (currentStep === 4) startGame();
  else stopGame();
}

function stopGame() {
  if (spawnTimer) {
    clearTimeout(spawnTimer);
    spawnTimer = null;
  }
}

function startGame() {
  stopGame();
  if (collected >= 10) return;
  gameArena.querySelectorAll(".hair").forEach((hair) => hair.remove());
  arenaHint.style.opacity = "0";
  gameFeedback.textContent = collected === 0 ? "¡Agarralos mientras caen! 💗" : "Todavía quedan algunos... ¡vos podés!";
  scheduleHair(180);
}

function scheduleHair(delay = 0) {
  spawnTimer = setTimeout(() => {
    if (currentStep !== 4 || collected >= 10) return;
    spawnHair();
    scheduleHair(700 + Math.random() * 380);
  }, delay);
}

function spawnHair() {
  const hair = document.createElement("button");
  hair.type = "button";
  hair.className = "hair";
  hair.setAttribute("aria-label", "Agarrar pelo");
  hair.innerHTML = '<img src="mechon.png" alt="" />';

  const size = Math.min(86, Math.max(58, gameArena.clientWidth * 0.11));
  const maxX = Math.max(5, gameArena.clientWidth - size - 5);
  hair.style.left = `${5 + Math.random() * (maxX - 5)}px`;
  hair.style.top = "-70px";
  hair.addEventListener("click", () => collectHair(hair), { once: true });
  hair.addEventListener("animationend", () => hair.remove(), { once: true });
  gameArena.appendChild(hair);
}

function collectHair(hair) {
  if (!hair.isConnected || collected >= 10) return;
  hair.remove();
  collected += 1;
  hairCount.textContent = collected;
  progressBar.style.width = `${collected * 10}%`;
  gameFeedback.textContent = collected === 10 ? "¡Melena recuperada! ✨" : ["¡Bien ahí!", "¡Ese no se escapó!", "¡Más rápido!", "¡Vamos, ma! 💕"][Math.floor(Math.random() * 4)];
  if (collected >= 10) {
    stopGame();
    nextButton.disabled = false;
    arenaHint.textContent = "¡lo lograste! ✨";
    arenaHint.style.opacity = "1";
  }
}

nextButton.addEventListener("click", () => {
  if (currentStep === 4 && collected < 10) return;
  if (currentStep === steps.length - 1) {
    collected = 0;
    hairCount.textContent = "0";
    progressBar.style.width = "0%";
    arenaHint.textContent = "preparate... 🐾";
    showStep(0);
    return;
  }
  showStep(currentStep + 1);
});

showStep(0);
