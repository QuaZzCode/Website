const swiper = new Swiper('.mainSwiper', {
  slidesPerView: 2,       // one slide per page
  loop: true,
  // centeredSlides: false,   // align to left by default
  spaceBetween: 50,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  autoplay: {
    delay: 5000, // 5 seconds before changing slide
  },
   speed: 2000,  // animation speed
});
