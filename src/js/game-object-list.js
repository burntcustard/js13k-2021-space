const gameObjectList = [];

export default gameObjectList;

// TODO: Other game object list related functions, like getAllAlive()

gameObjectList.remove = function (item) {
  this.splice(this.findIndex((i) => i === item), 1);
};
