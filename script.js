"use strict";

// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Cookie
const header = document.querySelector(".header");
const cookieMessage = document.createElement("div");
cookieMessage.classList.add("cookie-message");
cookieMessage.innerHTML = `<p>We use cookied for improved functionality and analytics <button class ="btn btn--close-cookie"> Got it!</button></p>`;
header.after(cookieMessage);

// Remove cookie
const btnCookie = document.querySelector(".btn--close-cookie");
btnCookie.addEventListener("click", function () {
  cookieMessage.remove();
});

// Change cookie's style
cookieMessage.style.backgroundColor = "#37383d";
cookieMessage.style.height =
  Number.parseFloat(getComputedStyle(cookieMessage).height) + 20 + "px";

// Set an attribute
logo.alt = "It's designed by Tamami";

// 📝 Smooth scroll
// btnを押すとsection1に飛びたい
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: "smooth" });
});

// 📝 Page navigation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// 📝 Tabbed component
const buttons = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContents = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;
  // Remove previous ones
  buttons.forEach((button) =>
    button.classList.remove("operations__tab--active")
  );
  tabsContents.forEach((content) =>
    content.classList.remove("operations__content--active")
  );
  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
  console.log(clicked.dataset.tab);
});

// 📝 イベントハンドラーに引数を渡す
const nav = document.querySelector(".nav");

const hovering2 = function (e) {
  if (e.target.classList.contains("nav__link")) {
    console.log(this); // 0.5 or 1
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    const navset = [logo, ...siblings];
    navset.forEach((element) => {
      if (element !== link) element.style.opacity = this;
    });
  }
};

nav.addEventListener("mouseover", hovering2.bind(0.5));
nav.addEventListener("mouseout", hovering2.bind(1));

// 📝 Sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const trigger = function (entries) {
  if (!entries[0].isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(trigger, obsOptions);
headerObserver.observe(header);

// スクロールすると各セクションがスルッと入ってくる
const sections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  if (!entries[0].isIntersecting) return;
  else {
    entries[0].target.classList.remove("section--hidden");
    // 一度働いたオブザバーはもう動かないでほしいとき（軽量化）
    observer.unobserve(entries[0].target);
  }
};

const obsOptions2 = {
  root: null,
  threshold: 0.1,
};
const sectionObserver = new IntersectionObserver(revealSection, obsOptions2);

sections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// イメージ読み込みを最適化
const imgTargets = document.querySelectorAll("img[data-src");

const loadImg = function (entries, observer) {
  if (!entries[0].isIntersecting) return;
  entries[0].target.src = entries[0].target.dataset.src;
  entries[0].target.addEventListener("load", () =>
    entries[0].target.classList.remove("lazy-img")
  );
  observer.unobserve(entries[0].target);
};

const imgObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};
const imgObserver = new IntersectionObserver(loadImg, imgObsOptions);
imgTargets.forEach((img) => imgObserver.observe(img));

// 📝 Slider component
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
let curSlide = 0;

const slideToNext = function () {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
  });
};

const slideRight = function () {
  if (curSlide === slides.length - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  slideToNext();
  activateDot(curSlide);
};

const slideLeft = function () {
  if (curSlide === 0) {
    curSlide = slides.length - 1;
  } else {
    curSlide--;
  }
  slideToNext();
  activateDot(curSlide);
};

btnRight.addEventListener("click", slideRight);
btnLeft.addEventListener("click", slideLeft);

// キーボードイベントハンドラー
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") slideLeft();
  else if (e.key === "ArrowRight") slideRight();
  else return;
  activateDot(curSlide);
});

// ドットイベントハンドラー
const dotContainer = document.querySelector(".dots");
const createDots = function () {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

// ドットのまるポチ黒くする。
const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

dotContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("dots__dot")) return;
  curSlide = e.target.dataset.slide;
  slideToNext();
  activateDot(curSlide);
});

const init = function (slide) {
  slideToNext();
  createDots();
  activateDot(slide);
};
init(curSlide);

document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed DOM tree built!", e);
});
