import { $ } from './util';

const SceneController = {
  start: () => {
    $('.ui').setAttribute('aria-hidden', false);
    $('.splash').remove();
    SceneController.started = true;
  },
};

export default SceneController;
