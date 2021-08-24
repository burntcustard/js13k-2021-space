import Structure from './module';
import Box from '../shapes/box';

function handleMouseOver(event) {
  event.target.classList.add('placeholder-hover');
}

function handleMouseLeave(event) {
  event.target.classList.remove('placeholder-hover');
}

class Block extends Structure {
  constructor({ w, h, d }, props) {
    super({ w, h, d, ...props, powerUse: 20 });

    this.model = new Box({
      w,
      h,
      d,
      x: props.x,
      y: props.y,
      z: props.z,
    });

    this.model.sides.forEach((side) => {
      side.element.addEventListener('mouseover', handleMouseOver);
      side.element.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  update(elapsed, lights) {
    super.update(elapsed, lights);
  }
}

const block = {
  info: {
    name: 'block',
    cost: 1,
    w: 60,
    h: 60,
    d: 60,
  },
  new: (props) => new Block(block.info, props),
};

export default block;
