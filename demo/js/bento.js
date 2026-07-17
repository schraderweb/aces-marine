(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 768;
  var GLOW_COLOR = '49, 130, 206';
  var GLOW_RADIUS = 300;

  var CONFIG = {
    textAutoHide: true,
    enableStars: true,
    enableSpotlight: true,
    enableBorderGlow: true,
    enableTilt: true,
    enableMagnetism: true,
    clickEffect: true,
    particleCount: 12,
    glowColor: GLOW_COLOR,
    spotlightRadius: GLOW_RADIUS
  };

  var isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  });

  var shouldDisable = function () {
    return isMobile;
  };

  function createParticleElement(color) {
    var el = document.createElement('div');
    el.className = 'bento-particle';
    el.style.cssText =
      'background: rgba(' + color + ', 1); box-shadow: 0 0 6px rgba(' + color + ', 0.6);';
    return el;
  }

  function initParticleCard(card) {
    if (!CONFIG.enableStars) return;

    var particleCount = CONFIG.particleCount;
    var color = CONFIG.glowColor;
    var memoizedParticles = [];
    var particles = [];
    var timeouts = [];
    var isHovered = false;
    var tiltAnim = null;
    var magnetAnim = null;

    var rect = card.getBoundingClientRect();
    for (var i = 0; i < particleCount; i++) {
      var p = createParticleElement(color);
      p.style.left = Math.random() * rect.width + 'px';
      p.style.top = Math.random() * rect.height + 'px';
      memoizedParticles.push(p);
    }

    function clearParticles() {
      timeouts.forEach(function (t) { clearTimeout(t); });
      timeouts = [];
      if (magnetAnim) magnetAnim.kill();

      particles.forEach(function (p) {
        gsap.to(p, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
          onComplete: function () {
            if (p.parentNode) p.parentNode.removeChild(p);
          }
        });
      });
      particles = [];
    }

    function animateParticles() {
      if (!isHovered) return;

      memoizedParticles.forEach(function (particle, index) {
        var tid = setTimeout(function () {
          if (!isHovered || !card.parentNode) return;

          var clone = particle.cloneNode(true);
          card.appendChild(clone);
          particles.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
          });
        }, index * 100);

        timeouts.push(tid);
      });
    }

    card.addEventListener('mouseenter', function () {
      if (shouldDisable()) return;
      isHovered = true;
      animateParticles();

      if (CONFIG.enableTilt) {
        tiltAnim = gsap.to(card, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    });

    card.addEventListener('mouseleave', function () {
      isHovered = false;
      clearParticles();

      if (CONFIG.enableTilt && tiltAnim) {
        tiltAnim.kill();
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (CONFIG.enableMagnetism && magnetAnim) {
        magnetAnim.kill();
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    card.addEventListener('mousemove', function (e) {
      if (shouldDisable()) return;
      if (!CONFIG.enableTilt && !CONFIG.enableMagnetism) return;

      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      if (CONFIG.enableTilt) {
        var rotateX = ((y - centerY) / centerY) * -10;
        var rotateY = ((x - centerX) / centerX) * 10;

        if (tiltAnim) tiltAnim.kill();
        tiltAnim = gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (CONFIG.enableMagnetism) {
        var magnetX = (x - centerX) * 0.05;
        var magnetY = (y - centerY) * 0.05;

        if (magnetAnim) magnetAnim.kill();
        magnetAnim = gsap.to(card, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }

  function initClickEffect(card) {
    card.addEventListener('click', function (e) {
      if (shouldDisable() || !CONFIG.clickEffect) return;

      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      var ripple = document.createElement('div');
      ripple.className = 'bento-ripple';
      ripple.style.cssText =
        'width:' + (maxDistance * 2) + 'px;' +
        'height:' + (maxDistance * 2) + 'px;' +
        'background:radial-gradient(circle, rgba(' + CONFIG.glowColor + ',0.4) 0%, rgba(' + CONFIG.glowColor + ',0.2) 30%, transparent 70%);' +
        'left:' + (x - maxDistance) + 'px;' +
        'top:' + (y - maxDistance) + 'px;';

      card.appendChild(ripple);

      gsap.fromTo(ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }
        }
      );
    });
  }

  function initTiltMagnetism(card) {
    var tiltAnim = null;
    var magnetAnim = null;

    card.addEventListener('mouseleave', function () {
      if (shouldDisable()) return;

      if (CONFIG.enableTilt) {
        if (tiltAnim) tiltAnim.kill();
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (CONFIG.enableMagnetism) {
        if (magnetAnim) magnetAnim.kill();
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    card.addEventListener('mousemove', function (e) {
      if (shouldDisable()) return;
      if (!CONFIG.enableTilt && !CONFIG.enableMagnetism) return;

      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      if (CONFIG.enableTilt) {
        var rotateX = ((y - centerY) / centerY) * -10;
        var rotateY = ((x - centerX) / centerX) * 10;

        if (tiltAnim) tiltAnim.kill();
        tiltAnim = gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (CONFIG.enableMagnetism) {
        var magnetX = (x - centerX) * 0.05;
        var magnetY = (y - centerY) * 0.05;

        if (magnetAnim) magnetAnim.kill();
        magnetAnim = gsap.to(card, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }

  function initGlobalSpotlight() {
    if (!CONFIG.enableSpotlight) return;

    var section = document.querySelector('.bento-section');
    if (!section) return;

    var spotlight = document.createElement('div');
    spotlight.className = 'bento-global-spotlight';
    spotlight.style.background =
      'radial-gradient(circle, ' +
      'rgba(' + CONFIG.glowColor + ',0.15) 0%, ' +
      'rgba(' + CONFIG.glowColor + ',0.08) 15%, ' +
      'rgba(' + CONFIG.glowColor + ',0.04) 25%, ' +
      'rgba(' + CONFIG.glowColor + ',0.02) 40%, ' +
      'rgba(' + CONFIG.glowColor + ',0.01) 65%, ' +
      'transparent 70%)';
    document.body.appendChild(spotlight);

    var isInside = false;

    function calcSpotlight(radius) {
      return { proximity: radius * 0.5, fadeDistance: radius * 0.75 };
    }

    var handleMouseMove = function (e) {
      if (shouldDisable()) return;

      var sectionRect = section.getBoundingClientRect();
      var mouseInside =
        e.clientX >= sectionRect.left &&
        e.clientX <= sectionRect.right &&
        e.clientY >= sectionRect.top &&
        e.clientY <= sectionRect.bottom;

      var cards = section.querySelectorAll('.bento-card');

      if (!mouseInside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(function (c) { c.style.setProperty('--glow-intensity', '0'); });
        return;
      }

      var vals = calcSpotlight(CONFIG.spotlightRadius);
      var minDistance = Infinity;

      cards.forEach(function (card) {
        var cardRect = card.getBoundingClientRect();
        var centerX = cardRect.left + cardRect.width / 2;
        var centerY = cardRect.top + cardRect.height / 2;
        var distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        var effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        var glowIntensity = 0;
        if (effectiveDistance <= vals.proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= vals.fadeDistance) {
          glowIntensity = (vals.fadeDistance - effectiveDistance) / (vals.fadeDistance - vals.proximity);
        }

        updateCardGlow(card, e.clientX, e.clientY, glowIntensity, CONFIG.spotlightRadius);
      });

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      var targetOpacity =
        minDistance <= vals.proximity
          ? 0.8
          : minDistance <= vals.fadeDistance
            ? ((vals.fadeDistance - minDistance) / (vals.fadeDistance - vals.proximity)) * 0.8
            : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    var handleMouseLeaveDoc = function () {
      isInside = false;
      section.querySelectorAll('.bento-card').forEach(function (c) {
        c.style.setProperty('--glow-intensity', '0');
      });
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveDoc);
  }

  function updateCardGlow(card, mouseX, mouseY, glow, radius) {
    var rect = card.getBoundingClientRect();
    var relativeX = ((mouseX - rect.left) / rect.width) * 100;
    var relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', relativeX + '%');
    card.style.setProperty('--glow-y', relativeY + '%');
    card.style.setProperty('--glow-intensity', glow.toString());
    card.style.setProperty('--glow-radius', radius + 'px');
  }

  function initBento() {
    var section = document.querySelector('.bento-section');
    if (!section) return;

    var cards = section.querySelectorAll('.bento-card');

    cards.forEach(function (card) {
      if (CONFIG.enableStars) {
        initParticleCard(card);
      } else {
        initTiltMagnetism(card);
      }

      initClickEffect(card);

      if (CONFIG.enableBorderGlow) {
        card.classList.add('bento-card--border-glow');
      }
    });

    initGlobalSpotlight();
  }

  if (typeof gsap !== 'undefined') {
    initBento();
  }
})();
