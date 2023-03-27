
const introSlider = new Swiper(".intro-slider", {
  slidesPerView: "auto",
  spaceBetween: 0,
  loop: true,
  autoplay: {
    delay: 5000,
  },

  breakpoints: {
    750: {},
    1350: {},
  },
});

const prodCategorySlider = new Swiper(".prod-category-slider", {
  slidesPerView: "auto",
  spaceBetween: 0,
  navigation: {
    nextEl: ".prod-category-slider__btn-next",
    prevEl: ".prod-category-slider__btn-prev",
  },

  breakpoints: {
    900: {},
    1350: {},
  },
});

const benefitsSlider = new Swiper(".benefits-slider__inner", {
  slidesPerView: "auto",
  spaceBetween: 0,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },

  navigation: {
    nextEl: ".button-next",
    prevEl: ".button-prev",
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    750: {},
    1350: {},
  },
});

const currentUrl = window.location.href;

if (currentUrl.indexOf("#") != -1) {
  let urlAndAnchor = currentUrl.split("#");
  let anchor = urlAndAnchor[1];
  let slide = document.getElementById(anchor).getAttribute("aria-label");
  let slideIndex = parseInt(slide) - 1;
  benefitsSlider.slideTo(slideIndex);
}
