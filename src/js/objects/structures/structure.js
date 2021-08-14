import Object from '../object';
import resources from '../../resources';

export default class Structure extends Object {
  constructor(props) {
    super(props);

    // Do stuff that only structures need

    // Use power? (Where do we keep stats like power requirement?)
    this.powerUse = props.powerUse;
  }

  update() {
    if (this.powerUse) {
      resources.power.diff -= this.powerUse;
    }
  }
}
