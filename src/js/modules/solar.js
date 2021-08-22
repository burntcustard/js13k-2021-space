import Structure from './module';
import Box from '../shapes/box';

export default class Solar extends Structure {
  constructor(props) {
    const w = 108;
    const h = 20;
    const d = 53; // Structure needs depth for collisions, but model doesn't?

    super({ w, h, d, ...props, powerGen: 10 });

    this.model = new Box({
      w,
      h: 2,
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
