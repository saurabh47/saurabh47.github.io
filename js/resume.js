(function($) {
  "use strict"; // Start of use strict
  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var root = document.documentElement;

    function updateThemeToggle(theme) {
      if (theme === 'dark') {
        themeToggle.textContent = '☀️ Light';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      } else {
        themeToggle.textContent = '🌙 Dark';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      }
    }

    var activeTheme = root.getAttribute('data-theme') || 'dark';
    updateThemeToggle(activeTheme);

    themeToggle.addEventListener('click', function() {
      var nextTheme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      updateThemeToggle(nextTheme);
    });
  }

  var pipelineArchitecture = document.querySelector('.pipeline-architecture');
  if (pipelineArchitecture) {
    var pipelineChips = pipelineArchitecture.querySelectorAll('.pipeline-chip[data-pipeline-focus]');
    var pipelineStatus = pipelineArchitecture.querySelector('[data-pipeline-status]');
    var pipelineLayers = pipelineArchitecture.querySelectorAll('[data-pipeline-layer]');
    var statusMessages = {
      all: 'Showing all layers.',
      source: 'Highlighting source events and inputs.',
      stream: 'Highlighting Kafka, Flink, and Sink connector processing.',
      serving: 'Highlighting serving layer components: databases, auth services, and monitoring.',
      client: 'Highlighting application visualization endpoint.'
    };

    function setPipelineFocus(focusKey) {
      var normalizedFocus = focusKey || 'all';
      var showAll = normalizedFocus === 'all';

      pipelineArchitecture.classList.toggle('is-filtering', !showAll);

      Array.prototype.forEach.call(pipelineLayers, function(layerEl) {
        var layerTags = (layerEl.getAttribute('data-pipeline-layer') || '').split(/\s+/);
        var isMatch = showAll || layerTags.indexOf(normalizedFocus) !== -1;
        layerEl.classList.toggle('is-match', isMatch);
      });

      Array.prototype.forEach.call(pipelineChips, function(chipEl) {
        var isActive = chipEl.getAttribute('data-pipeline-focus') === normalizedFocus;
        chipEl.classList.toggle('is-active', isActive);
        chipEl.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      if (pipelineStatus) {
        pipelineStatus.textContent = statusMessages[normalizedFocus] || statusMessages.all;
      }
    }

    Array.prototype.forEach.call(pipelineChips, function(chipEl) {
      chipEl.addEventListener('click', function() {
        setPipelineFocus(chipEl.getAttribute('data-pipeline-focus'));
      });
    });

    setPipelineFocus('all');
  }

})(jQuery); // End of use strict
