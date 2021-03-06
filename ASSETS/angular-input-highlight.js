// Generated by CoffeeScript 1.9.3
(function() {
  angular.module('input-highlight', []).directive('highlight', [
    '$parse', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, el, attrs) {
          var canvas, container, ctx, formatting, i, input, len, mirror, onChange, prop, render, spread, style, textProps;
          input = el[0];
          if (input.tagName !== 'TEXTAREA') {
            return;
          }
          spread = 2;
          mirror = angular.element('<div style="position:relative"></div>')[0];
          container = angular.element('<div style="position:absolute;width:0px;height:0px;overflow:hidden;"></div>')[0];
          textProps = ['font-size', 'font-family', 'font-style', 'font-weight', 'font-variant', 'font-stretch', 'line-height', 'vertical-align', 'word-spacing', 'text-align', 'letter-spacing', 'text-rendering', 'padding', 'border'];
          document.body.appendChild(container);
          container.appendChild(mirror);
          el.css({
            'background-position': '0 0',
            'background-repeat': 'no-repeat'
          });
          style = window.getComputedStyle(input);
          mirror.style['white-space'] = 'pre-wrap';
          console.log('font-family', style['font-family']);
          for (i = 0, len = textProps.length; i < len; i++) {
            prop = textProps[i];
            mirror.style[prop] = style[prop];
          }
          if (style['resize'] === 'both') {
            el.css('resize', 'vertical');
          }
          if (style['resize'] === 'horizontal') {
            el.css('resize', 'none');
          }
          formatting = scope[attrs.highlight] || {};
          onChange = angular.noop;
          if (attrs.highlightOnchange) {
            onChange = (function() {
              var fn;
              fn = $parse(attrs.highlightOnchange);
              return function(markers) {
                return fn(scope, {
                  $markers: markers
                });
              };
            })();
          }
          canvas = document.createElement('canvas');
          ctx = canvas.getContext('2d');
          render = function(text) {
            var color, j, len1, m, marker, markers, originalText, re, ref;
            markers = [];
            originalText = text;
            mirror.innerHTML = text;
            mirror.style.width = style.width;
            canvas.width = mirror.clientWidth;
            canvas.height = mirror.clientHeight;
            for (color in formatting) {
              re = formatting[color];
              mirror.innerHTML = text.replace(re, function(s) {
                return "<span style=\"position:relative\" data-marker=\"" + color + "\">" + s + "</span>";
              });
              ref = mirror.querySelectorAll('span[data-marker]');
              for (j = 0, len1 = ref.length; j < len1; j++) {
                m = ref[j];
                marker = {
                  text: m.innerHTML,
                  color: m.getAttribute('data-marker'),
                  x: m.offsetLeft - spread,
                  y: m.offsetTop,
                  width: m.offsetWidth + 2 * spread - 1,
                  height: m.offsetHeight + 1
                };
                ctx.fillStyle = color;
                ctx.fillRect(marker.x, marker.y, marker.width, marker.height);
                markers.push(marker);
              }
            }
            el.css('background-image', "url(" + (canvas.toDataURL()) + ")");
            return onChange(markers);
          };
          if (attrs.ngModel) {
            scope.$watch(attrs.ngModel, render);
          } else {
            render(input.value);
            anguar.element(input).on('change', function() {
              return render(this.value);
            });
          }
          scope.$watch(attrs.highlight, function(_formatting) {
            formatting = _formatting || {};
            return render(input.value);
          }, true);
          scope.$on('$destroy', function() {
            return container.parentNode.removeChild(container);
          });
          return el.on('scroll', function() {
            return el.css('background-position', "0 -" + input.scrollTop + "px");
          });
        }
      };
    }
  ]);

}).call(this);