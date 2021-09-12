import { $ } from './util';

const SceneController = {
  started: false,
  start: () => {
    $('.ui').setAttribute('aria-hidden', false);
    $('.splash').remove();
    SceneController.started = true;
  },
};

export default SceneController;
