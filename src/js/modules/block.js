import Structure from './module';
import Box from '../shapes/box';

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
  }

  update(elapsed, lights) {
    super.update(elapsed, lights);

    if (this.active) {
      this.model.rx += 0.01;
    }
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
