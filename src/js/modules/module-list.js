import Block from './block';
import BlockMulti from './block-multi';
import Hab from './hab';
import Hangar from './hangar';
import HexBlock from './hex-block';
import Ring from './ring';
import Scaffold from './scaffold';
import Solar from './solar';
import StorePower from './store-power';

const moduleList = [
  Block,
  Scaffold,
  BlockMulti,
  HexBlock,
  Solar,
  Hab,
  Hangar,
  Ring,
  StorePower,
];

moduleList.get = function (tag) {
  return this.find((module) => module.tag === tag);
};

export default moduleList;
