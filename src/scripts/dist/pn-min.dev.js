"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.onload = function () {
  var t = document.querySelector("#particle-canvas"),
      e = document.createElement("canvas");
  t.appendChild(e);
  var i = e.getContext("2d");
  var o = {
    drawparticle: !1,
    particleWidth: .7,
    particleSize: 2,
    particleAlpha: .4,
    particleColor: "#fff",
    maxDistance: 200,
    interactive: !0,
    velocity: .1,
    density: 12e3
  };
  var a = {
    width: 0,
    height: 0
  };
  e.width = a.width = t.offsetWidth, e.height = a.height = t.offsetHeight;

  var h =
  /*#__PURE__*/
  function () {
    function h() {
      _classCallCheck(this, h);

      this.x = Math.random() * e.width, this.y = Math.random() * e.height, this.velocity = {
        x: (Math.random() - .5) * o.velocity,
        y: (Math.random() - .5) * o.velocity
      };
    }

    _createClass(h, [{
      key: "update",
      value: function update() {
        (this.x > e.width + 20 || this.x < -20) && (this.velocity.x = -this.velocity.x), (this.y > e.height + 20 || this.y < -20) && (this.velocity.y = -this.velocity.y), this.x += this.velocity.x, this.y += this.velocity.y;
      }
    }, {
      key: "draw",
      value: function draw() {
        i.beginPath(), i.fillStyle = o.particleColor, i.globalAlpha = o.particleAlpha, i.arc(this.x, this.y, o.particleSize, 0, 2 * Math.PI), i.fill();
      }
    }]);

    return h;
  }();

  var n,
      r = [];
  window.addEventListener("resize", function () {
    if (t.offsetWidth === a.width && t.offsetHeight === a.height) return !1;
    e.width = a.width = t.offsetWidth, e.height = a.height = t.offsetHeight, r = [];

    for (var i = 0; i < e.width * e.height / o.density; i++) {
      r.push(new h());
    }

    o.interactive && r.push(n), window.innerHeight / 1080 > window.innerWidth / 1980 ? e.style.backgroundSize = "auto 100%" : e.style.backgroundSize = "100% auto";
  });

  for (var l = 0; l < e.width * e.height / o.density; l++) {
    r.push(new h());
  }

  o.interactive && ((n = new h()).velocity = {
    x: 0,
    y: 0
  }, r.push(n), window.addEventListener("mousemove", function (t) {
    n.x = t.clientX - e.offsetLeft, n.y = t.clientY - e.offsetTop;
  }), window.addEventListener("mouseup", function (t) {
    n.velocity = {
      x: (Math.random() - .5) * o.velocity,
      y: (Math.random() - .5) * o.velocity
    }, (n = new h()).velocity = {
      x: 0,
      y: 0
    }, r.push(n), n.x = t.clientX - e.offsetLeft, n.y = t.clientY - e.offsetTop;
  })), window.innerHeight / 1080 > window.innerWidth / 1980 ? e.style.backgroundSize = "auto 100%" : e.style.backgroundSize = "100% auto", requestAnimationFrame(function t() {
    i.clearRect(0, 0, e.width, e.height);

    for (var a = 0; a < r.length; a++) {
      r[a].update(), o.drawparticle && r[a].draw();

      for (var h = r.length - 1; h > a; h--) {
        var n = Math.sqrt(Math.pow(r[a].x - r[h].x, 2) + Math.pow(r[a].y - r[h].y, 2));
        n > o.maxDistance || (i.beginPath(), i.strokeStyle = o.particleColor, i.globalAlpha = (o.maxDistance - n) / o.maxDistance, i.lineWidth = o.particleWidth, i.moveTo(r[a].x, r[a].y), i.lineTo(r[h].x, r[h].y), i.stroke());
      }
    }

    0 !== o.velocity && requestAnimationFrame(t);
  });
};