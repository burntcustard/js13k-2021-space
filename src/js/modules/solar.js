import Module from './module';
import Box from '../shapes/box';

class Solar extends Module {
  constructor({ w, h, d, cost, powerGen }, props) {
    super({ w, h, d, cost, ...props, powerGen });

    this.model = new Box({
      w,
      h,
      d,
      x: props.x,
      y: props.y,
      z: props.z,
      classNames: [
        'solar',
        'panel',
        '',
        '',
        '',
        '',
        'panel',
      ],
    });
  }
}

const solar = {
  info: {
    name: 'Solar Panel Basic',
    desc: 'Generates power',
    powerGen: 10,
    cost: 35,
    w: 108,
    h: 2,
    d: 53,
  },
  new: (props) => new Solar(solar.info, props),
};

export default solar;
