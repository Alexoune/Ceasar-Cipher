import Titre from './scenes/titre.js';
import MenuScreen from "./scenes/menuscreen.js";
import AboutUs from "./scenes/aboutUs.js";
import Load from "./scenes/load.js";
import Story from './scenes/story.js';
import LevelBuilder from './scenes/levelbuilder.js';

import Player from './classes/player.js';

const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
       debug: true
    }
  },
  scene: [Load, MenuScreen, AboutUs, Story, LevelBuilder]
};

const game = new Phaser.Game(config);