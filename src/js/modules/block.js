import Module from './module';
import Box from '../shapes/box';

export default function Block({
  x, y, z, rx, ry, rz,
}) {
  this.name = 'block';
  this.cost = 1;
  this.power = -15;
  this.w = 60;
  this.h = 60;
  this.d = 60;
  this.model = new Box({
    w: this.w,
    h: this.h,
    d: this.d,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    className: this.name,
  });
  // Modules don't do anything when you first make them?
  // Module.call(this, { x, y, z, rx, ry, rz });
}

Block.prototype = Object.create(Module.prototype);
Block.prototype.constructor = Block;

// function handleMouseOver(event) {
//   event.target.classList.add('placeholder-hover');
// }
//
// function handleMouseLeave(event) {
//   event.target.classList.remove('placeholder-hover');
// }
//
// class Block extends Structure {
//   constructor({ w, h, d }, props) {
//     super({ w, h, d, ...props, powerUse: 20 });
//
//     this.model = new Box({
//       w,
//       h,
//       d,
//       x: props.x,
//       y: props.y,
//       z: props.z,
//     });
//
//     this.model.sides.forEach((side) => {
//       side.element.addEventListener('mouseover', handleMouseOver);
//       side.element.addEventListener('mouseleave', handleMouseLeave);
//     });
//   }
//
//   update(elapsed, lights) {
//     super.update(elapsed, lights);
//   }
// }
//
// const block = {
//   info: {
//     name: 'block',
//     cost: 1,
//     w: 60,
//     h: 60,
//     d: 60,
//   },
//   new: (props) => new Block(block.info, props),
// };
//
// export default block;
