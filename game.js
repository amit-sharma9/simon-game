// Elements
const body = document.body;
const h2   = document.getElementById("start-msg");
const para = document.getElementById("para");
const highDisp = document.getElementById("highscore-display");
const buttons  = document.querySelectorAll(".basic");

// Game state
let sequence  = [];
let userSeq   = [];
let level      = 0;
let started    = false;
let highscore = Number(localStorage.getItem("highscore")) || 0;

// Audio
const audioWrong = new Audio("wrong-38598.mp3");

// Initialize highscore display
highDisp.innerText = `Highscore: ${highscore}`;

// Utility to flash a button
function flashButton(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 200);
}

// Utility to flash user click
function flashUser(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 200);
}

// Update start message dynamically
function updateStartMsg() {
  h2.innerText = window.innerWidth <= 768
    ? "Tap anywhere to start"
    : "Press any key to start";
}
updateStartMsg();
window.addEventListener("resize", updateStartMsg);

// Build restart message
function restartMsg(score) {
  return `Game over!<br>Your score: ${score}. ${
    window.innerWidth <= 768 ? "Tap" : "Press"
  } to restart.`;
}

// Add start listeners once
function addStartListeners() {
  body.addEventListener("keypress", startHandler, { once: true });
  body.addEventListener("touchstart", startHandler, { once: true });
  body.addEventListener("click", startHandler, { once: true });
}
// Handler that ignores taps on color squares
function startHandler(e) {
  if (
    (e.type === "click" || e.type === "touchstart") &&
    e.target.classList.contains("basic")
  ) return;
  
  if (!started) {
    started = true;
    para.innerText = "";
    nextLevel();
  }
}
addStartListeners();

// Advance to next level: only flash new color
function nextLevel() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  // pick & flash single new color
  const idx = Math.floor(Math.random() * buttons.length);
  const btn = buttons[idx];
  sequence.push(btn.id);
  flashButton(btn);

  // now listen for user clicks
  buttons.forEach(b => b.addEventListener("click", handleUserClick));
}

// When user clicks a color
function handleUserClick(e) {
  const btn = e.target;
  flashUser(btn);
  userSeq.push(btn.id);

  const i = userSeq.length - 1;
  if (userSeq[i] !== sequence[i]) {
    // wrong answer
    audioWrong.play();
    document.body.style.backgroundColor = "red";
    setTimeout(() => (document.body.style.backgroundColor = "white"), 150);

    // update highscore if beaten
    if (level > highscore) {
      highscore = level;
      localStorage.setItem("highscore", highscore);
      highDisp.innerText = `Highscore: ${highscore}`;
    }

    // show restart prompt
    h2.innerHTML = restartMsg(level);
    para.innerText = ""; // clear any other text

    cleanUp();
    addStartListeners();
  } else if (userSeq.length === sequence.length) {
    // correct full sequence
    document.body.style.backgroundColor = "lightgreen";
    setTimeout(() => (document.body.style.backgroundColor = "white"), 150);

    // go to next level after short delay
    setTimeout(nextLevel, 600);
  }
}

// Remove click listeners and reset state
function cleanUp() {
  started = false;
  level   = 0;
  sequence = [];
  userSeq  = [];
  buttons.forEach(b => b.removeEventListener("click", handleUserClick));
}
