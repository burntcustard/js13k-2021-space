import Block from './block';
import Hab from './hab';
import Hangar from './hangar';
import HexBlock from './hex-block';
import Ring from './ring';
import Scaffold from './scaffold';
import Solar from './solar';

const moduleList = [
  Scaffold,
  Block,
  HexBlock,
  Solar,
  Hab,
  Hangar,
  Ring,
];

moduleList.get = function (tag) {
  return this.find((module) => module.tag === tag);
};

export default moduleList;
