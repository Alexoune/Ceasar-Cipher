const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 320;
const TILE_LENGTH = 32;

var player;

var cursors;

// Mouvement
const v = 200; // vitesse en px/s
const t = (TILE_LENGTH/v); // temps en s
var vx = 0;
var vy = 0;
var xAxis;
var yAxis;
var startX;
var startY;

var startPressTime = 0;
var canPress = true;

class Test extends Phaser.Scene {
  preload() {
    this.load.image('stick', 'assets/stick.png');

    this.load.image('tiles', 'spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');

  }

  create() {
    player = this.physics.add.sprite(0, 0, 'stick');
    player.setScale(2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("spritefusion", "tiles");
    //const sky = map.createLayer("Sky", tileset, 0, 0);

  }

  update(time) {
    if (canPress) {
      xAxis = (+cursors.right.isDown) - (+cursors.left.isDown);
      yAxis = (+cursors.down.isDown) - (+cursors.up.isDown);
      if (xAxis != 0 || yAxis != 0) {
        startPressTime = time;
        startX = player.x;
        startY = player.y;
        canPress = false;
        if(xAxis > 0) vx = v;
        if(xAxis < 0) vx = -v;
        if(yAxis > 0) vy = v;
        if(yAxis < 0) vy = -v;
      }
    } else {
      if ((time - startPressTime)/1000 >= t) {
        vx = 0;
        vy = 0;
        player.setPosition(startX + xAxis*TILE_LENGTH, startY + yAxis*TILE_LENGTH);
        canPress = true;
      }
    }
    player.setVelocity(vx,vy);
  }

  }

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
};

const game = new Phaser.Game(config);

game.scene.add('Test', Test);

game.scene.start('Test');