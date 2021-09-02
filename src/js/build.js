import resources from './resources';
import gameObjectList from './game-object-list';
import Vec3 from './vec3';

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

Build.addEventListenersTo = (side) => {
  side.mouseoverListener = () => {
    if (!Build.currentItem) {
      return;
    }

    // eslint-disable-next-line prefer-destructuring
    const model = Build.currentItemInstance.model;
    const shape = side.parent;
    const sideRotated = new Vec3(side.x, side.y, side.z)
      .rotateX(shape.rx)
      .rotateY(shape.ry)
      .rotateZ(shape.rz);

    model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    model.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    Build.currentHoverSide = side;
    model.x = shape.x + sideRotated.x + Math.sign(Math.round(sideRotated.x)) * model.w * 0.5;
    model.y = shape.y + sideRotated.y + Math.sign(Math.round(sideRotated.y)) * model.w * 0.5;
    model.z = shape.z + sideRotated.z + Math.sign(Math.round(sideRotated.z)) * model.w * 0.5;
    model.rx = Build.rotation;
    model.ry = Math.atan2(sideRotated.z, sideRotated.x);
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
    if (!Build.currentItem || side.hasConnectedModule || Build.cantAffordCurrentItem) {
      return;
    }
    Build.currentItemInstance.build();
    gameObjectList.push(Build.currentItemInstance);
    side.hasConnectedModule = true;
    side.element.classList.add('obstructed'); // TODO: Refactor this er somehow

    Build.setCurrentItem(Build.currentItem);
    // Assuming we can't build models on top of each other, new one is obstructed
    Build.currentItemInstance.model.element.classList.add('obstructed');
  };

  side.element.addEventListener('mouseover', side.mouseoverListener);
  side.element.addEventListener('mouseleave', side.mouseleaveListener);
  side.element.addEventListener('click', side.clickListener);
};

export default Build;
