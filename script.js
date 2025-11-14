// === СЛУЧАЙНЫЕ ФОТО ===
async function loadRandomImages(count = 8) {
  const imagesContainer = document.getElementById("images");
  imagesContainer.innerHTML = "Загрузка...";

  try {
    let html = "";
    for (let i = 0; i < count; i++) {
      const url = `https://picsum.photos/400/300?random=${Math.random()}`;
      html += `<img src="${url}" alt="Random Image">`;
    }
    imagesContainer.innerHTML = html;
  } catch (error) {
    imagesContainer.textContent = "Ошибка загрузки изображений 😢";
  }
}

loadRandomImages(8);


// === ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ===
(function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  document.documentElement.setAttribute("data-theme", savedTheme || "light");
  updateThemeButtonText(savedTheme || "light");
})();

document.getElementById("themeToggle").addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButtonText(newTheme);
});

function updateThemeButtonText(theme) {
  const btn = document.getElementById("themeToggle");
  btn.textContent = theme === "dark" ? "☀️ Светлая тема" : "🌓 Темная тема";
}


// ============================
//    КАРУСЕЛЬ ОТЗЫВОВ + API
// ============================

// Карточки (4 шт)
const reviewCards = document.querySelectorAll(".review-card");

// Трек и кнопки
const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

// Индекс текущего слайда
let index = 0;
const totalSlides = reviewCards.length;


// ===== ЗАГРУЗКА ОДНОГО ОТЗЫВА =====
async function loadQuote(card) {
  const textEl = card.querySelector("p");
  const authorEl = card.querySelector("span");

  textEl.textContent = "Загрузка...";
  authorEl.textContent = "";

  try {
    const response = await fetch("http://api.quotable.io/random");
    const data = await response.json();

    textEl.textContent = `«${data.content}»`;
    authorEl.textContent = data.author ? `- ${data.author}` : "- неизвестно";

  } catch (error) {
    textEl.textContent = "Не удалось загрузить отзыв 😢";
    authorEl.textContent = "";
  }
}


// ===== ЗАГРУЗКА ВСЕХ ОТЗЫВОВ =====
async function loadAllReviews() {
  for (const card of reviewCards) {
    await loadQuote(card);
  }
}

// загружаем при входе на сайт
loadAllReviews();


// ===== КНОПКА «Обновить отзывы» =====
const reloadBtn = document.getElementById("reloadReviews");

reloadBtn.addEventListener("click", async () => {
  reviewCards.forEach(card => {
    card.querySelector("p").textContent = "Загрузка...";
    card.querySelector("span").textContent = "";
  });

  await loadAllReviews();
});


// ===== КАРУСЕЛЬ =====
nextBtn.addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  updateCarousel();
});

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}
