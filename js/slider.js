'use strict';
(function() {
  var slider = document.querySelector('.slider');
  var prev = slider.querySelector('.slider__button--prev');
  var next = slider.querySelector('.slider__button--next');
  var container = slider.querySelector('.slider__slide-container');
  var radioContainer = slider.querySelector('.slider__thumbler-container')
  var radio = slider.getElementsByTagName('input');

  var step = parseFloat(getComputedStyle(slider).width);
  var transitionContainer = 'transform .5s linear';
  var pos = 0;
  var shift = 0;
  var allLength;
  var timer;

  function createClone() {
    pos = -step;
    container.style.transform = 'translateX(' + pos + 'px)';
    var prevSlide = container.children[0].cloneNode(true);
    var nextSlide = container.children[container.children.length - 1].cloneNode(true);
    container.insertBefore(nextSlide, container.children[0]);
    container.appendChild(prevSlide);
    allLength = container.children.length;
  }
  createClone();

  function checkRadio() {
    var target = event.target;
    if(target.tagName !== 'INPUT') return;
    resetAutoplay();
    radio.indexOf = [].indexOf;
    shift = radio.indexOf(target);
    pos = (shift+1) * -step;
    target.checked = true;
    container.style.transform = 'translateX(' + pos + 'px)';
    autoplay();
  }

  function setPrimarySettings() {
    if(document.visibilityState === 'hidden') {
      resetAutoplay();
    } else {
      pos = -step;
      shift = 0;
      radio[shift].checked = true;
      container.style.transition = '';
      container.style.transform = 'translateX(' + pos + 'px)';
      autoplay();
    }
  }

  function movePrev() {
    !shift ? shift = radio.length - 1 : shift--;
    if(!pos) {
      pos = -step * (allLength-2);
      container.style.transition = 'null';
      container.style.transform = 'translateX(' + pos + 'px)';
    }
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        container.style.transition = transitionContainer;
        pos += step;
        container.style.transform = 'translateX(' + pos + 'px)';
        radio[shift].checked = true;
      });
    });
  }

  function moveNext() {
    shift === radio.length - 1 ? shift=0 : shift++;
    if(pos === -step * (allLength-1)) {
      pos = -step;
      container.style.transition = 'null';
      container.style.transform = 'translateX(' + pos + 'px)';
    }
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        container.style.transition = transitionContainer;
        pos -= step;
        container.style.transform = 'translateX(' + pos + 'px)';
        radio[shift].checked = true;
      });
    });
  }

  function autoplay() {
    timer = setTimeout(function() {
      moveNext();
      autoplay();
    }, 4000);
  }
  autoplay();

  function resetAutoplay() {
    clearTimeout(timer);
  }

  document.addEventListener('visibilitychange', setPrimarySettings);

  radioContainer.addEventListener('change', checkRadio);

  prev.addEventListener('click', function() {
    resetAutoplay();
    movePrev();
    autoplay();
  });

  next.addEventListener('click', function() {
    resetAutoplay();
    moveNext();
    autoplay();
  });
})();
