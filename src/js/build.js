import resources from './resources';
import gameObjectList from './game-object-list';

const Build = {
  currentItem: false,
  currentItemInstance: false,
  currentHoverSide: false,
  cantAffordCurrentItem: false,
};

Build.setCurrentItem = (Item) => {
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

    Build.currentItemInstance.model.element.style.display = '';
    side.element.classList.add('build-hover');
    side.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    Build.currentItemInstance.model.element.classList.toggle('obstructed', side.hasConnectedModule ?? false);
    Build.currentHoverSide = side;
    Build.currentItemInstance.model.x = side.x;
    Build.currentItemInstance.model.y = side.y;
    Build.currentItemInstance.model.z = side.z;
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
