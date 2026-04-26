const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 320;
const TILE_LENGTH = 32;
const MAP_OFFSET = 16;

// Joueur
var player;
var moves = [];

// Clones
const cloneLimit = 1;
const cloneLateFactor = 3;
var clone;
var cloneGroup;
var cloneCount = 0;

// Touches
var cursors;
var xAxis;
var yAxis;

// Mouvement
const t = 0.25;
const v = (TILE_LENGTH/t);
var vx = 0;
var vy = 0;
const directionMap = [
  {check: v => v.vx > 0, dir: 0, vd: [ 1, 0] },
  {check: v => v.vy < 0, dir: 1, vd: [ 0,-1] },
  {check: v => v.vx < 0, dir: 2, vd: [-1, 0] },
  {check: v => v.vy > 0, dir: 3, vd: [ 0, 1] },
];

// Position
var startX = 1;
var startY = 1;
var mapX = startX;
var mapY = startY;
var nextMapX = mapX;
var nextMapY = mapY;

// Tracking
var occupied = [];

// Temps
var startPressTime = 0;
var elapsed = 0;

// Condition
var pressed = false;
var moving = false;

// Level
var layer;

function drawArrow(graphics, x1, y1, x2, y2) {
  graphics.lineStyle(4, 0xff0000, 1);
  graphics.lineBetween(x1, y1, x2, y2);
}

function pushMoveFromVelocity(vx, vy) {
  if(vx == 0 && vy == 0) return;

  directionMap.forEach(d => {
    if(d.check({ vx, vy })) moves.push(d.dir);
  });
}

function moveClonesFromInput() {
  cloneGroup.children.each(function (clone) {
    let i = moves[clone.stepCount];
    let vd = directionMap[i].vd;

    [clone.vx, clone.vy] = [vd[0]*v, 
                            vd[1]*v];

    [clone.mapX, clone.mapY] = [clone.mapX + vd[0], 
                                clone.mapY + vd[1]];

    clone.stepCount += 1;

    clone.setVelocity(clone.vx, clone.vy);
  });
}

function stopClonesFromMoving() {
  cloneGroup.children.each(function (clone) {
    clone.vx = 0;
    clone.vy = 0;
    clone.setVelocity(clone.vx, clone.vy);

    clone.setPosition(
      MAP_OFFSET + clone.mapX*TILE_LENGTH, 
      MAP_OFFSET + clone.mapY*TILE_LENGTH
    );

    clone.nextMapX = clone.mapX + directionMap[moves[clone.stepCount]].vd[0];
    clone.nextMapY = clone.mapY + directionMap[moves[clone.stepCount]].vd[1];
    //console.log(clone.nextMapX, clone.nextMapY);
    });
}

function spawnClone() {
  cloneCount += 1;

  clone = cloneGroup.create(
    MAP_OFFSET + startX*TILE_LENGTH,
    MAP_OFFSET + startY*TILE_LENGTH,
    'stick'
  );

  Object.assign(clone, {
    vx: 0,
    vy: 0,
    mapX: startX,
    mapY: startY,
    stepCount: 0,
    nextMapX: 0,
    nextMapY: 0
  });

  clone.setScale(2);
}

function whileMoving(time) {
  elapsed = (time - startPressTime)/1000;

  if (elapsed >= t) {
    pushMoveFromVelocity(vx, vy);

    moving = false;
    [vx, vy] = [0, 0];
    player.setVelocity(vx,vy);

    [mapX, mapY] = [nextMapX, nextMapY];
    console.log(mapX,mapY)

    player.setPosition(
      MAP_OFFSET + mapX*TILE_LENGTH, 
      MAP_OFFSET + mapY*TILE_LENGTH
    );

    stopClonesFromMoving();

    if (moves.length % cloneLateFactor == 0 && cloneCount < cloneLimit) spawnClone();
  }
}

function playerInput(time) {
  xAxis = (+cursors.right.isDown) - (+cursors.left.isDown);
  yAxis = (+cursors.down.isDown) - (+cursors.up.isDown);

  if (xAxis != 0 || yAxis != 0) {
    if (!pressed) {
      pressed = true;
      moving = true;
      startPressTime = time;

      [vx, vy] = [v*xAxis, v*yAxis];
      player.setVelocity(vx,vy);
          
      nextMapX += xAxis;
      nextMapY += yAxis;

      moveClonesFromInput();
    }
  } else {
    pressed = false;
  }
}

class Test extends Phaser.Scene {
  preload() {
    this.load.image('stick', 'assets/stick.png');

    this.load.image('cube', 'assets/cube.png');

    this.load.image('tiles', 'assets/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');

  }

  create() {    
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('spritefusion', 'tiles');

    layer = map.createStaticLayer('Ground', tileset, 0, 0).setScale(2);

    player = this.physics.add.sprite(
      MAP_OFFSET + TILE_LENGTH*mapX,
      MAP_OFFSET + TILE_LENGTH*mapY, 
      'stick'
    );
    player.setScale(2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, layer);

    cloneGroup = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    const graphics = this.add.graphics();
    drawArrow(graphics, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  }

  update(time) {
    if (moving) {
      whileMoving(time);
    } else {
      playerInput(time);
    }
  } 

}

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
       debug: false
    }
  },
};

const game = new Phaser.Game(config);

game.scene.add('Test', Test);

game.scene.start('Test');


/*

Joueur/Clone: États quand il va bouger
  - Normal: Aller vers une case libre, normalement
  - Percute: Se cogne contre le joueur, un mur ou un clone
  - Normal-pousseur: Pousse le joueur ou un clone, et va vers une case libre
  - Percute-pousseur: Pousse le joueur ou un clone, mais cogne quelque chose
  - Normal-poussé: Se fait pousser par le joueur ou un clone, et va vers une case libre ET/OU évite de cogner quelque chose
  - Percute-poussé: Se fait pousser par le joueur ou un clone, mais cogne quelque chose

*/