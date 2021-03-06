import Build from '../build';
import Shape from './shape';
import Face from './face';
import { $, PI_2 } from '../util';
import UI from '../ui';
import { camera } from '../camera';
import gameObjectList from '../game-object-list';

/**
 * Create a cubemap (just an inside-out cube).
 * @param {*} properties
 */
export default function Cubemap({ w, x, y, z, rx, ry, rz }) {
  Shape.call(this, { w, d: w, h: w, x, y, z, rx, ry, rz, className: 'skybox' });

  const W_2 = w * 0.5;

  this.sides = [
    new Face({
      w,
      h: w,
      z: -W_2,
    }),
    new Face({
      w,
      h: w,
      y: W_2,
      rx: PI_2,
    }),
    new Face({
      w,
      h: w,
      x: W_2,
      rx: -PI_2,
      rz: PI_2,
    }),
    new Face({
      w,
      h: w,
      y: -W_2,
      rx: -PI_2,
    }),
    new Face({
      w,
      h: w,
      x: -W_2,
      rx: -PI_2,
      rz: -PI_2,
    }),
    new Face({
      w,
      h: w,
      z: W_2,
      rx: Math.PI,
    }),
  ];
  this.element.append(...this.sides.map((side) => side.element));
  this.spawn();

  this.sides.forEach((side) => {
    side.element.addEventListener('mousedown', () => { side.dragged = false; });
    side.element.addEventListener('mousemove', () => { side.dragged = true; });
    side.element.addEventListener('mouseup', () => {
      if (side.dragged) return;

      gameObjectList.deselectAll();
      $('.ui-panel--btns').setAttribute('aria-hidden', true);
      $('.ui-panel__build-info').classList.remove('ui-panel__build-info--select');
      $('.ui-panel__build-info').innerHTML = ''; // Remove infos
      $('.ui-panel__build-list').innerHTML = ''; // Remove object buttons
      $('.ui-panel__build-list').style.display = '';
      $('.ui-panel__build-list').append(...UI.buildBarList);

      // Cancel building whatever is the current build item
      UI.deselectAllBuildBarItems();
      Build.setCurrentItem(false);
    });
  });
}

Cubemap.prototype = Object.create(Shape.prototype);
Cubemap.prototype.constructor = Cubemap;

Cubemap.prototype.update = function () {
  this.x = -camera.x;
  this.y = -camera.y;
  this.z = -camera.z;
  this.element.style.transform = `
    translate3D(${this.x}px, ${this.y}px, ${this.z}px)
    rotateX(${this.rx})
    rotateY(${this.ry})
    rotateZ(${this.rz})
    scale3D(99, 99, 99)`;
};
