const pages = document.querySelectorAll(".book-page");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageCount = document.getElementById("pageCount");
const startBtn = document.getElementById("startBtn");

let currentPage = 0;
let isAnimating = false;

function showPage(index) {
  if (isAnimating || index < 0 || index >= pages.length) return;

  isAnimating = true;

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  pages[index].classList.add("active");

  currentPage = index;
  pageCount.textContent = `${index + 1} / ${pages.length}`;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;

  prevBtn.style.opacity = index === 0 ? "0.45" : "1";
  nextBtn.style.opacity = index === pages.length - 1 ? "0.45" : "1";

  setTimeout(() => {
    isAnimating = false;
  }, 950);
}

nextBtn.addEventListener("click", () => {
  showPage(currentPage + 1);
});

prevBtn.addEventListener("click", () => {
  showPage(currentPage - 1);
});

startBtn.addEventListener("click", () => {
  showPage(1);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") showPage(currentPage + 1);
  if (e.key === "ArrowLeft") showPage(currentPage - 1);
});

let touchStartX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;

  if (touchStartX - touchEndX > 70) {
    showPage(currentPage + 1);
  }

  if (touchEndX - touchStartX > 70) {
    showPage(currentPage - 1);
  }
});

showPage(currentPage);