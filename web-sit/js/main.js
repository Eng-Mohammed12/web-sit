// Main JavaScript File - Global Functions and Initializers

document.addEventListener("DOMContentLoaded", function () {
  // يجب أن تكون أول دالة تُستدعى لتحميل الإعدادات المحفوظة
  initializeThemeAndSettings();

  initializeMobileNav();

  // تشغيل السلايدر فقط إذا كان موجوداً في الصفحة الحالية
  if (document.getElementById("imageSlider")) {
    initializeSlider();
  }

  // تشغيل حماية لوحة التحكم في الصفحات المخصصة
  if (document.body.classList.contains("protected-page")) {
    protectDashboardPages();
  }
});

/**
 * يقوم بتحميل وتطبيق الثيم، اللون الأساسي، واسم الموقع من LocalStorage.
 */
function initializeThemeAndSettings() {
  const theme = localStorage.getItem("theme") || "light";
  const primaryColor = localStorage.getItem("primaryColor") || "#007bff";
  const siteName = localStorage.getItem("siteName") || "موقعي";

  applyTheme(theme);
  applyPrimaryColor(primaryColor);
  applySiteName(siteName);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function applyPrimaryColor(color) {
  document.documentElement.style.setProperty("--primary-color", color);
}

function applySiteName(name) {
  document.querySelectorAll(".nav-logo h2, #siteTitle").forEach((el) => {
    el.textContent = name;
  });
}

/**
 * تهيئة قائمة التنقل في وضع الموبايل.
 */
function initializeMobileNav() {
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
  }
}

/* 
   ===============================================================
   تفعيل زر تغيير الثيم (الشمس والقمر)
   ===============================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  const themeToggleButton = document.getElementById("theme-toggle-button");

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", function () {
      // تحقق من الثيم الحالي
      const currentTheme = document.documentElement.getAttribute("data-theme");

      // قم بتبديل الثيم
      if (currentTheme === "dark") {
        applyTheme("light"); // دالة applyTheme موجودة لديك بالفعل
      } else {
        applyTheme("dark");
      }
    });
  }
});

function initializeSlider() {
  // 1. تحديد العناصر
  const sliderContainer = document.querySelector(".slider-container");
  if (!sliderContainer) return;

  const slider = document.getElementById("imageSlider");
  const sliderDots = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // 2. بناء الشرائح
  const allProducts = getFromLocalStorage("dashboardData") || [];
  const sliderProducts = allProducts.filter((p) => p.showInSlider);
  const itemsToDisplay =
    sliderProducts.length > 0
      ? sliderProducts
      : [
          {
            image: "images/slide1.jpg",
            name: "مرحباً في موقعنا",
            description: "هذا مثال لشريحة عرض أولى.",
          },
          {
            image: "images/slide2.jpg",
            name: "خدمات مميزة",
            description: "يمكنك إدارة هذه الشرائح من لوحة التحكم.",
          },
          {
            image: "images/slide3.jpg",
            name: "تصاميم عصرية",
            description: "نقدم لك أفضل الحلول البرمجية.",
          },
        ];

  let slidesHTML = "";
  let dotsHTML = "";
  itemsToDisplay.forEach((item, index) => {
    slidesHTML += `<div class="slide"><img src="${item.image}" alt="${item.name}"><div class="slide-content"><h3>${item.name}</h3><p>${item.description}</p></div></div>`;
    dotsHTML += `<span class="dot" data-slide="${index}"></span>`;
  });
  slider.innerHTML = slidesHTML;
  sliderDots.innerHTML = dotsHTML;

  // 3. إعادة تحديد العناصر بعد بنائها
  const slides = slider.querySelectorAll(".slide");
  const dots = sliderDots.querySelectorAll(".dot");
  const totalSlides = slides.length;
  let currentSlide = 0;
  let autoSlideInterval;

  // 4. التعامل مع حالة وجود شريحة واحدة
  if (totalSlides <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (slides.length > 0) slides[0].classList.add("active");
    if (dots.length > 0) dots[0].classList.add("active");
    return;
  }

  // 5. الدالة الأساسية لتحديث العرض (طريقة opacity)
  function updateSlider() {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  // 6. دالة الانتقال
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
    resetAutoSlide();
  }

  // 7. ربط الأحداث
  nextBtn.addEventListener("click", () => {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
  });

  prevBtn.addEventListener("click", () => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // 8. التشغيل التلقائي
  const autoSlideEnabled = localStorage.getItem("autoSlide") !== "false";
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    if (autoSlideEnabled) {
      autoSlideInterval = setInterval(() => {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
      }, 5000);
    }
  }

  sliderContainer.addEventListener("mouseenter", () =>
    clearInterval(autoSlideInterval)
  );
  sliderContainer.addEventListener("mouseleave", resetAutoSlide);

  // 9. التشغيل الأولي
  updateSlider();
  resetAutoSlide();
}

function showToast(message, type = "success", duration = 3000) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

function generateId() {
  return Date.now();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

function showFieldError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) errorElement.textContent = message;
}

function clearFieldError(fieldId) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) errorElement.textContent = "";
}
