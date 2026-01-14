const swiper = new Swiper('.mainSwiper', {
  loop: true,
  spaceBetween: 50,
  speed: 2000,
  autoplay: {
    delay: 5000,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },

  breakpoints: {
    0: {
      slidesPerView: 1,   // phones
    },
    900: {
      slidesPerView: 2,   // tablets & up
    }
  },
  autoplay: {
    delay: 5000, // 5 seconds before changing slide
  },
   speed: 2000,  // animation speed
});

