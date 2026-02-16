/* global NexT: true */

$(document).ready(function () {

  $(document).trigger('bootstrap:before');

  NexT.utils.isMobile() && window.FastClick.attach(document.body);

  NexT.utils.lazyLoadPostsImages();

  NexT.utils.registerBackToTop();

  $('.drawer-toggle').on('click', function () {
    var $sidebar = $('.sidebar-wrapper');
    var $overlay = $('.sidebar-overlay');
    var isOpen = $sidebar.hasClass('sidebar-open');
    if (isOpen) {
      $sidebar.removeClass('sidebar-open');
      $overlay.removeClass('sidebar-open');
      $('body').removeClass('sidebar-open');
    } else {
      $sidebar.addClass('sidebar-open');
      $overlay.addClass('sidebar-open');
      $('body').addClass('sidebar-open');
    }
  });

  $('.sidebar-overlay').on('click', function () {
    $('.sidebar-wrapper').removeClass('sidebar-open');
    $('.sidebar-overlay').removeClass('sidebar-open');
    $('body').removeClass('sidebar-open');
  });


  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  NexT.utils.embeddedVideoTransformer();
  NexT.utils.addActiveClassToMenuItem();


  // Define Motion Sequence.
  NexT.motion.integrator
    .add(NexT.motion.middleWares.logo)
    .add(NexT.motion.middleWares.menu)
    .add(NexT.motion.middleWares.postList)
    .add(NexT.motion.middleWares.sidebar);

  $(document).trigger('motion:before');

  // Bootstrap Motion.
  CONFIG.motion && NexT.motion.integrator.bootstrap();

  $(document).trigger('bootstrap:after');
});
