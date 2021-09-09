/* eslint-disable no-nested-ternary */
const createBuildScreenHTML = (Item) => `
  <div>
    <b>${Item.tag}</b>
    <div>M:${Item.cost}${Item.population ? ` | Pop:${Item.population}` : ''}${Item.power < 0 ? ` | Use ϟ${-Item.power}` : Item.power > 0 ? ` | Gen ϟ${Item.power}` : ''}</div>
  </div>
  <div>
    ${Item.desc}
  </div>
`;

export default createBuildScreenHTML;
