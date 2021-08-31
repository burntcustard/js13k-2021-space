import resources from './resources';
import gameObjectList from './game-object-list';
import { PI_2 } from './util';

const Build = {
  currentItem: false,
  currentItemInstance: false,
  currentHoverSide: false,
  cantAffordCurrentItem: false,
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

Build.addEventListenersTo = (side) => {
  side.mouseoverListener = () => {
    if (!Build.currentItem) {
      return;
    }

    // eslint-disable-next-line prefer-destructuring
    const model = Build.currentItemInstance.model;
    const shape = side.parent;

    model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    model.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    Build.currentHoverSide = side;
    model.x = side.attachment.x + Math.sign(side.attachment.x) * model.w * 0.5 + shape.x;
    model.y = side.attachment.y + Math.sign(side.attachment.y) * model.d * 0.5 + shape.y;
    model.z = side.attachment.z + Math.sign(side.attachment.z) * model.h * 0.5 + shape.z;
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
