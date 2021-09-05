import resources from './resources';
import gameObjectList from './game-object-list';
import Vec3 from './vec3';
import { PI, PI_2 } from './util';

const Build = {
  currentItem: false,
  currentItemInstance: false,
  currentHoverSide: false,
  cantAffordCurrentItem: false,
  rotation: 0,
};

Build.setCurrentItem = (Item) => {
  if (!Item) {
    if (Build.currentHoverSide) {
      Build.currentHoverSide.element.classList.remove('build-hover');
    }
    if (Build.currentItemInstance) {
      Build.currentItemInstance.model.element.style.display = 'none';
    }
    Build.currentItem = false;
    Build.currentItemInstance = false;
    return;
  }

  Build.currentItem = Item;
  Build.currentItemInstance = new Item({});
  Build.currentItemInstance.spawnFrame();
};

Build.updateCantAffordCurrentItem = () => {
  Build.cantAffordCurrentItem = resources.mats.current < Build.currentItem.cost;
};

Build.update = () => {
  if (Build.currentItem) {
    Build.updateCantAffordCurrentItem();
    Build.currentItemInstance.model.element.classList.toggle(
      'err-cost',
      Build.cantAffordCurrentItem,
    );
    if (Build.currentHoverSide) {
      Build.currentHoverSide.element.classList.toggle(
        'err-cost',
        Build.cantAffordCurrentItem,
      );
    }
  }
};

Build.updateRotation = () => {
  Build.currentItemInstance.model.rx = Build.rotation;
  Build.currentItemInstance.update();
};

Build.addInnerShadows = (side) => {
  const attachedToIndex = side.parent.sides.indexOf(side);

  if (attachedToIndex === 0) {
    for (let i = 1; i < side.parent.sides.length - 1; i++) {
      side.parent.sides[i].element.style.setProperty('--shadow-l', '#000');
      side.parent.sides[i].element.classList.add('shadow-inner');
    }
  }

  if (attachedToIndex === 1) {
    side.parent.sides[0].element.classList.add('shadow-inner');
    side.parent.sides[0].element.style.setProperty('--shadow-b', '#000');
    // side.parent.sides[1].element.style.setProperty('--shadow-b', '#ff0');
    side.parent.sides[2].element.classList.add('shadow-inner');
    side.parent.sides[2].element.style.setProperty('--shadow-b', '#000');
    side.parent.sides[3].element.classList.add('shadow-inner');
    side.parent.sides[3].element.style.setProperty('--shadow-t', '#000');
    // side.parent.sides[4].element.style.setProperty('--shadow-t', '#00f');
    side.parent.sides[5].element.classList.add('shadow-inner');
    side.parent.sides[5].element.style.setProperty('--shadow-b', '#000');
  }

  if (attachedToIndex === 2) {
    side.parent.sides[0].element.classList.add('shadow-inner');
    side.parent.sides[0].element.style.setProperty('--shadow-r', '#000');
    side.parent.sides[1].element.classList.add('shadow-inner');
    side.parent.sides[1].element.style.setProperty('--shadow-t', '#000');
    // side.parent.sides[2].element.style.setProperty('--shadow-r', '#000');
    // side.parent.sides[3].element.style.setProperty('--shadow-l', '#000');
    side.parent.sides[4].element.classList.add('shadow-inner');
    side.parent.sides[4].element.style.setProperty('--shadow-b', '#000');
    side.parent.sides[5].element.classList.add('shadow-inner');
    side.parent.sides[5].element.style.setProperty('--shadow-l', '#000');
  }

  if (attachedToIndex === 3) {
    side.parent.sides[0].element.classList.add('shadow-inner');
    side.parent.sides[0].element.style.setProperty('--shadow-l', '#000');
    side.parent.sides[1].element.classList.add('shadow-inner');
    side.parent.sides[1].element.style.setProperty('--shadow-b', '#000');
    // side.parent.sides[2].element.style.setProperty('--shadow-r', '#000');
    // side.parent.sides[3].element.style.setProperty('--shadow-l', '#000');
    side.parent.sides[4].element.classList.add('shadow-inner');
    side.parent.sides[4].element.style.setProperty('--shadow-t', '#000');
    side.parent.sides[5].element.classList.add('shadow-inner');
    side.parent.sides[5].element.style.setProperty('--shadow-r', '#000');
  }

  if (attachedToIndex === 4) {
    side.parent.sides[0].element.classList.add('shadow-inner');
    side.parent.sides[0].element.style.setProperty('--shadow-t', '#000');
    // side.parent.sides[1].element.style.setProperty('--shadow-b', '#ff0');
    side.parent.sides[2].element.classList.add('shadow-inner');
    side.parent.sides[2].element.style.setProperty('--shadow-t', '#000');
    side.parent.sides[3].element.classList.add('shadow-inner');
    side.parent.sides[3].element.style.setProperty('--shadow-b', '#000');
    // side.parent.sides[4].element.style.setProperty('--shadow-t', '#000');
    side.parent.sides[5].element.classList.add('shadow-inner');
    side.parent.sides[5].element.style.setProperty('--shadow-t', '#000');
  }

  // Far side
  if (attachedToIndex === 5) {
    for (let i = 0; i < side.parent.sides.length - 1; i++) {
      side.parent.sides[i].element.classList.add('shadow-inner');
      side.parent.sides[i].element.style.setProperty('--shadow-r', '#000');
    }
  }
};

Build.addEventListenersTo = (side) => {
  side.mouseoverListener = () => {
    if (!Build.currentItem) {
      return;
    }

    // eslint-disable-next-line prefer-destructuring
    const model = Build.currentItemInstance.model;
    const shape = side.parent;

    // Side rotated with shape's rotation
    const sideRotated = new Vec3(side.x, side.y, side.z)
      .rotateX(shape.rx)
      .rotateY(shape.ry)
      .rotateZ(shape.rz);

    const sideNormalised = sideRotated.normalise();

    // Half model width in direction of side
    const sideResized = sideRotated.resize(model.w * 0.5);

    model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.connectedTo ?? false);
    model.element.classList.toggle('obstructed', side.connectedTo ?? false);
    Build.currentHoverSide = side;
    model.x = shape.x + sideRotated.x + sideResized.x;
    model.y = shape.y + sideRotated.y + sideResized.y;
    model.z = shape.z + sideRotated.z + sideResized.z;
    model.rx = Build.rotation;
    model.ry = -Math.asin(sideNormalised.z);
    model.rz = Math.atan2(sideRotated.y, sideRotated.x);
    Build.currentItemInstance.update();
  };

  side.mouseleaveListener = () => {
    if (!Build.currentItem) {
      return;
    }

    side.element.classList.remove('build-hover');
    Build.currentItemInstance.model.element.style.display = 'none';
    Build.currentHoverSide = null;
  };

  side.clickListener = () => {
    if (!Build.currentItem || side.connectedTo || Build.cantAffordCurrentItem) {
      return;
    }

    Build.currentItemInstance.build();
    gameObjectList.push(Build.currentItemInstance);
    side.connectedTo = Build.currentItemInstance;
    Build.currentItemInstance.connectedTo = side;
    side.element.classList.add('obstructed'); // TODO: Refactor this er somehow

    if (Build.currentItemInstance.model.sides[0].w > side.w
      && side.parent.parent.tag === 'Block') {
      side.element.classList.add('shadow-outer');

      Build.addInnerShadows(side);
    }

    if (Build.currentItemInstance.model.sides[0].w < side.w
      && Build.currentItemInstance.tag === 'Block') {
      Build.currentItemInstance.model.sides[0].element.classList.add('shadow-outer');

      Build.addInnerShadows(Build.currentItemInstance.model.sides[0]);
    }

    Build.setCurrentItem(Build.currentItem);
    // Assuming we can't build models on top of each other, new one is obstructed
    Build.currentItemInstance.model.element.classList.add('obstructed');
  };

  side.element.addEventListener('mouseover', side.mouseoverListener);
  side.element.addEventListener('mouseleave', side.mouseleaveListener);
  side.element.addEventListener('click', side.clickListener);
};

Build.rotate = () => {
  if (!Build.currentItem) return;
  // TODO: increment should be based on how many sides the selected item has
  Build.rotation = (Build.rotation + PI_2) % (PI * 2);
  Build.updateRotation();
};

export default Build;
