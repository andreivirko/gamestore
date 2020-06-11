"use strict";

const Ant = function (crslId) {
  let id = document.getElementById(crslId);
  if (id) {
    this.crslRoot = id;
  } else {
    this.crslRoot = document.querySelector(".ant-carousel");
  }
  this.crslList = this.crslRoot.querySelector(".ant-carousel-list");
  this.crslElements = this.crslRoot.querySelectorAll(".ant-carousel-element");
  this.crslFirstElement = this.crslRoot.querySelector(".ant-carousel-element");
  this.leftArrow = this.crslRoot.querySelector("div.ant-carousel-arrow-left");
  this.rightArrow = this.crslRoot.querySelector("div.ant-carousel-arrow-right");
  this.listDots = this.crslRoot.querySelector(".ant-carousel-dots");
  this.options = Ant.defaults;
  Ant.initialize(this);
};

Ant.defaults = {
  elemVisible: 1, // количество отображаемых елементов в каруселе
  loop: false, // зацикливание карусели
  auto: true, // автоматическая прокуртка
  interval: 6000, // интервал между прокруткой елементов
  speed: 750, // скорость анимации
  touch: true, // прокрутка прекосновением
  arrows: true, // прокрутка стрелками
  dots: true, // индикаторные точки
};

Ant.prototype.elemPrev = function (num) {
  num = num || 1;

  if (this.options.dots) this.dotOn(this.currentElement);
  this.currentElement -= num;
  if (this.currentElement < 0) this.currentElement = this.dotsVisible - 1;
  if (this.options.dots) this.dotOff(this.currentElement);
  if (!this.options.loop) {
    // здвиг в право без цикла
    this.currentOffSet += this.elemWidth * num;
    this.crslList.style.marginLeft = this.currentOffSet + "px";

    if (this.currentElement == 0) {
      this.leftArrow.style.display = "none";
      this.touchPrev = false;
    }
    this.rightArrow.style.display = "block";
    this.touchNext = true;
  } else {
    let elem,
      buf,
      this$ = this;
    for (let i = 0; i < num; i++) {
      elem = this.crslList.lastElementChild;
      buf = elem.cloneNode(true);
      this.crslList.insertBefore(buf, this.crslList.firstElementChild);
      elem.remove();
    }
    this.crslList.style.cssText =
      "transition: margin" + this.options.speed + "ms easy";
    this.crslList.style.marginLeft = "0px";
    setTimeout(function () {
      this$.crslList.style.cssText = "transition: none";
    }, this.options.speed);
  }
};

Ant.prototype.elemNext = function (num) {
  num = num || 1;
  if (this.options.dots) this.dotOn(this.currentElement);
  this.currentElement += num;
  if (this.currentElement >= this.dotsVisible) this.currentElement = 0;
  if (this.options.dots) this.dotOff(this.currentElement);

  if (!this.options.loop) {
    this.currentOffSet -= this.elemWidtaddh * num;
    this.crslList.style.marginLeft = this.currentOffSet + "px";
    if (this.currentElement === this.dotsVisible - 1) {
      this.rightArrow.style.display = "none";
      this.touchNext = false;
    }
    this.leftArrow.style.display = "block";
    this.touchPrev = true;
  } else {
    let elem,
      buf,
      this$ = this;
    this.crslList.style.cssText =
      "transition: margin" + this.options.speed + "ms ease";
    this.crslList.style.marginLeft = "-" + this.elemWidth * num + "px";
    setTimeout(function () {
      this$.crslList.style.cssText = "transition: none";
      for (let i = 0; i <= num; i += 1) {
        elem = this$.crslList.firstElementChild;
        buf = elem.cloneNode(true);
        this$.crslList.append(buf);
        elem.remove();
      }
      this$.crslList.style.marginLeft = "0px";
    }, this.options.speed);
  }
};

Ant.prototype.dotOn = function (num) {
  this.listDotsAll[num].style.cssText = "background-color: #BBB; cursor: pointer;";
};

Ant.prototype.dotOff = function (num) {
  this.listDotsAll[num].style.cssText = "background-color: #555; cursor: default;";
};

Ant.initialize = function (that) {
  that.elemCount = that.crslElements.length;
  that.dotsVisible = that.elemCount;
  let elemStyle = window.getComputedStyle(that.crslFirstElement);
  that.elemWidth =
    that.crslFirstElement.offsetWidth +
    parseInt(elemStyle.marginLeft) +
    parseInt(elemStyle.marginRight);

  that.currentElement = 0;
  that.currentOffSet = 0;
  that.touchPrev = true;
  that.touchnext = true;
  let xTouch, yTouch, xDif, yDif, stTime, mvTime;
  let currentTime = getTime();
  function getTime() {
    return new Date().getTime();
  }
  function setAutoScroll() {
    that.setAutoScroll = setInterval(function () {
      let funcTime = getTime();
      if (funcTime - currentTime + 20 > that.options.interval) {
        currentTime = funcTime;
        that.elemNext();
      }
    }, that.options.interval);
  }

  if (that.elemCount <= that.options.elemVisible) {
    that.options.auto = false;
    that.options.touch = false;
    that.options.arrows = false;
    that.options.dots = false;
    that.leftArrow.style.display = "none";
    that.rightArrow.style.display = "none";
  }

  if (!that.options.loop) {
    that.dotsVisible = that.elemCount - that.options.elemVisible + 1;
    that.leftArrow.style.display = "none";
    that.touchPrev = false;
    that.options.auto = false;
  } else if (that.options.auto) {
    setAutoScroll();
    that.crslList.addEventListener(
      "mouseenter",
      function () {
        clearInterval(that.setAutoScroll);
      },
      false
    );
    that.crslList.addEventListener("mouseleave", setAutoScroll, false);
  }

  if (that.options.touch) {
    that.crslList.addEventListener(
      "touchstart",
      function (event) {
        xTouch = parseInt(event.touches[0].clientX);
        yTouch = parseInt(event.touches[0].clientY);
        stTime = getTime();
      },
      false
    );

    that.crslList.addEventListener(
      "touchmove",
      function (event) {
        if (!xTouch || !yTouch) return;
        xDif = xTouch - parseInt(event.touches[0].clientX);
        yDif = yTouch - parseInt(event.touches[0].clientY);
        mvTime = getTime();
        if (
          Math.abs(xDif) > 15 &&
          Math.abs(xDif) > Math.abc(yDif) &&
          mvTime - stTime < 75
        ) {
          stTime = 0;
          if (that.touchNext && xDif > 0) {
            currentTime = mvTime;
            that.elemNext();
          } else if (that.touchPrev && xDif < 0) {
            currentTime = mvTime;
            that.elemPrev();
          }
        }
      },
      false
    );
  }
  if (that.options.arrows) {
    if (!that.options.loop) {
      that.crslList.style.cssText =
        "transition: margin" + that.options.speed + "ms ease;";
      that.leftArrow.addEventListener(
        "click",
        function () {
          let fnTime = getTime();
          if (fnTime - currentTime > that.options.speed) {
            fnTime = currentTime;
            that.elemPrev();
          }
        },
        false
      );
      that.rightArrow.addEventListener(
        "click",
        function () {
          let fnTime = getTime();
          if (fnTime - currentTime > that.options.speed) {
            fnTime = currentTime;
            that.elemNext();
          }
        },
        false
      );
    } else {
      that.leftArrow.style.display = "none";
      that.rightArrow.style.display = "none";
    }
    if (that.options.dots) {
      let sum = "",
        difNum;
      for (let i = 0; i < that.dotsVisible; i++) {
        sum += '<span class="ant-dot"></span>';
      }
      that.listDots.innerHTML = sum;
      that.listDotsAll = that.crslRoot.querySelectorAll("span.ant-dot");
      for (let j = 0; j < that.dotsVisible; j++) {
        that.listDotsAll[j].addEventListener(
          "click",
          function () {
            difnum = Math.abs(j - currentElement);
            if (j < that.currentElement) {
              currentTime = getTime();
              that.elemPrev(difNum);
            } else if (j > that.currentElement) {
              currentTime = getTime();
              that.elemNext(difNum);
            }
          },
          false
        );
      }
      that.dotOff(0);
      for (let k = 0; k < that.dotsVisible; k++) {
        that.dotOn(k);
      }
    }
  }
};

new Ant();