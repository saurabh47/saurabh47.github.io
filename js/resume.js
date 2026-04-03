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

  var pipelineShowcase = document.querySelector('.pipeline-showcase');
  if (pipelineShowcase) {
    var actionButtons = pipelineShowcase.querySelectorAll('.pipeline-action');
    var speedSelect = pipelineShowcase.querySelector('#pipelineSpeed');
    var statusText = pipelineShowcase.querySelector('.pipeline-status');
    var nodes = Array.prototype.slice.call(pipelineShowcase.querySelectorAll('.pipeline-node'));
    var ingestedMetric = pipelineShowcase.querySelector('[data-metric="ingested"]');
    var processedMetric = pipelineShowcase.querySelector('[data-metric="processed"]');
    var dashboardMetric = pipelineShowcase.querySelector('[data-metric="dashboard"]');
    var ANIMATION_BASE_INTERVAL_MS = 900;
    var ANIMATION_MIN_INTERVAL_MS = 280;
    var INGESTED_INCREMENT_PER_TICK = 120;
    var PROCESSED_INCREMENT_PER_TICK = 90;
    var FLINK_STAGE_INDEX = nodes.findIndex(function(node) {
      return node.getAttribute('data-stage') === 'flink';
    });

    var counters = {
      ingested: 0,
      processed: 0,
      dashboard: 0
    };
    var timer = null;
    var currentStage = -1;
    var speed = parseFloat(pipelineShowcase.getAttribute('data-flow-speed')) || 1;

    function clearHighlights() {
      nodes.forEach(function(node) {
        node.classList.remove('is-active');
      });
    }

    function updateMetrics() {
      if (ingestedMetric) {
        ingestedMetric.textContent = counters.ingested.toLocaleString();
      }
      if (processedMetric) {
        processedMetric.textContent = counters.processed.toLocaleString();
      }
      if (dashboardMetric) {
        dashboardMetric.textContent = counters.dashboard.toLocaleString();
      }
    }

    function tick() {
      currentStage = (currentStage + 1) % nodes.length;
      clearHighlights();
      nodes[currentStage].classList.add('is-active');

      counters.ingested += INGESTED_INCREMENT_PER_TICK;
      if (FLINK_STAGE_INDEX !== -1 && currentStage >= FLINK_STAGE_INDEX) {
        counters.processed += PROCESSED_INCREMENT_PER_TICK;
      }
      if (currentStage === nodes.length - 1) {
        counters.dashboard += 1;
      }

      updateMetrics();
    }

    function getTickInterval() {
      return Math.max(ANIMATION_MIN_INTERVAL_MS, ANIMATION_BASE_INTERVAL_MS / speed);
    }

    function setStatus(text) {
      if (statusText) {
        statusText.textContent = text;
      }
    }

    function startFlow() {
      if (timer) {
        return;
      }
      pipelineShowcase.classList.add('is-running');
      pipelineShowcase.classList.remove('is-paused');
      setStatus('Status: Running');
      timer = setInterval(tick, getTickInterval());
    }

    function pauseFlow() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = null;
      pipelineShowcase.classList.remove('is-running');
      pipelineShowcase.classList.add('is-paused');
      setStatus('Status: Paused');
    }

    function resetFlow() {
      pauseFlow();
      clearHighlights();
      currentStage = -1;
      counters.ingested = 0;
      counters.processed = 0;
      counters.dashboard = 0;
      updateMetrics();
      pipelineShowcase.classList.remove('is-paused');
      setStatus('Status: Idle');
    }

    actionButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var action = button.getAttribute('data-action');
        if (action === 'start') {
          startFlow();
        } else if (action === 'pause') {
          pauseFlow();
        } else if (action === 'reset') {
          resetFlow();
        }
      });
    });

    if (speedSelect) {
      speedSelect.addEventListener('change', function() {
        speed = parseFloat(speedSelect.value) || 1;
        pipelineShowcase.style.setProperty('--flow-speed', speed.toFixed(2));
        if (timer) {
          window.clearInterval(timer);
          timer = setInterval(tick, getTickInterval());
        }
      });
      pipelineShowcase.style.setProperty('--flow-speed', speed.toFixed(2));
    }
  }

})(jQuery); // End of use strict
