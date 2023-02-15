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
});

const productsSlider = new Swiper(".products-slider", {
  slidesPerView: "auto",
  spaceBetween: 0,
  navigation: {
    nextEl: ".products-slider__btn-next",
    prevEl: ".products-slider__btn-prev",
  },

  breakpoints: {
    900: {},
    1350: {},
  },
});
