// Fade-in page load animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 1s ease";
  setTimeout(() => document.body.style.opacity = "1", 100);
});

// Cursor glow effect
const cursorCanvas = document.createElement("canvas");
cursorCanvas.style.position = "fixed";
cursorCanvas.style.inset = "0";
cursorCanvas.style.zIndex = "1000";
cursorCanvas.style.pointerEvents = "none";
document.body.appendChild(cursorCanvas);

const ctx = cursorCanvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("mousemove", e => {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? "#c7922c" : "#9b59b6",
      opacity: 1
    });
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  particles.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color === "#c7922c" ? "199,146,44" : "155,89,182"},${p.opacity})`;
    ctx.fill();
    p.size *= 0.97;
    p.opacity -= 0.02;
    if (p.opacity <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
