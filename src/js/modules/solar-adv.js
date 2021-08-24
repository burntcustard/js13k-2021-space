import Module from './module';
import Box from '../shapes/box';

class SolarAdv extends Module {
  constructor({ w, h, d, powerGen }, props) {
    super({ w, h, d, ...props, powerGen });

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

const solarAdv = {
  info: {
    name: 'Solar Panel Basic',
    desc: 'Generates more power',
    powerGen: 2,
    cost: 9,
    w: 168,
    h: 2,
    d: 53,
  },
  new: (props) => new SolarAdv(solarAdv.info, props),
};

export default solarAdv;
