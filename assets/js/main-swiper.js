const swiper = new Swiper('.mainSwiper', {
  slidesPerView: 1,       // one slide per page
  loop: true,
  centeredSlides: false,   // align to left by default
  spaceBetween: 50,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
});
