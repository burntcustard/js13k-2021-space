import resources from './resources';

/* eslint-disable no-nested-ternary */
function createBuildScreenHTML(Item) {
  const noEco = Item.cost > resources.mats.current;
  const unlocked = Item.unlock === true;

  // console.log(Item);

  return `
    <div>
      <b>${unlocked ? Item.tag : 'LOCKED'}</b>
      <div>${unlocked ? `${noEco ? '<b>' : ''}M:${Item.cost}${noEco ? '</b>' : ''}${Item.population ? ` | Pop:${Item.population}` : ''}${Item.power < 0 ? ` | Use ↯${-Item.power}` : Item.power > 0 ? ` | Gen ↯${Item.power}` : ''}` : ''}</div>
    </div>
    <div>
      ${unlocked ? (noEco ? 'INSUFFICIENT RESOURCES' : Item.desc) : `-  ${Item.unlockText}`}
    </div>
  `;
}

export default createBuildScreenHTML;
