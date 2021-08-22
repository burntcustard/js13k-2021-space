import Structure from './module';
import Box from '../shapes/box';

export default class Block extends Structure {
  constructor(props) {
    const w = 20;
    const h = 20;
    const d = 20;

    super({ w, h, d, ...props, powerUse: 20 });

    // Create a new box shape
    this.model = new Box({
      w,
      h,
      d,
      x: props.x,
      y: props.y,
      z: props.z,
      className: 'block',
    });
  }
}
