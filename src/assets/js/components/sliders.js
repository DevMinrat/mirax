// const introSlider = new Swiper(".intro-silder", {
// slidesPerView: "auto",
// spaceBetween: 37,

// pagination: {
//   el: ".swiper-pagination",
//   type: "progressbar",
// },

// navigation: {
//   nextEl: ".intro-slider__btn-next",
//   prevEl: ".intro-slider__btn-prev",
// },

// breakpoints: {
//   900: {
//     spaceBetween: 50,
//   },
//   1350: {
//     slidesPerView: "auto",
//     spaceBetween: 80,
//   },
// },
//   });

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

  // Добавление точек
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    750: {},
    1350: {},
  },
});
