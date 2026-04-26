const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 320;
const TILE_LENGTH = 32;
const MAP_OFFSET = 16;

// Joueur
var player;
var moves = [];

// Clones
const cloneLimit = 3;
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
let tile;

// Visuel
let g;

function drawArrow(g, x1, y1, x2, y2, headLength = 10) {
  g.lineBetween(x1, y1, x2, y2);

  const angle = Math.atan2(y2 - y1, x2 - x1);

  const leftX  = x2 - headLength * Math.cos(angle - Math.PI / 5);
  const leftY  = y2 - headLength * Math.sin(angle - Math.PI / 5);
  const rightX = x2 - headLength * Math.cos(angle + Math.PI / 5);
  const rightY = y2 - headLength * Math.sin(angle + Math.PI / 5);

  g.lineBetween(x2, y2, rightX, rightY);
  g.lineBetween(x2, y2, leftX, leftY);

}

function pushMoveFromVelocity(vx, vy) {
  if(vx == 0 && vy == 0) {
    moves.push(null);
    return;
  }

  directionMap.forEach(d => {
    if(d.check({ vx, vy })) moves.push(d.dir);
  });
}

function moveClonesFromInput() {
  cloneGroup.children.each(function (clone) {    
    if (clone.i != null) {
      let vd = directionMap[clone.i].vd;

      [clone.vx, clone.vy] = [vd[0]*v, 
                            vd[1]*v];

      [clone.mapX, clone.mapY] = [clone.mapX + vd[0], 
                                clone.mapY + vd[1]];

      clone.setVelocity(clone.vx, clone.vy);
    }

    clone.stepCount += 1;

  });
}

function stopClonesFromMoving() {
  cloneGroup.children.each(function (clone) {
    [clone.vx, clone.vy] = [0, 0];
    clone.setVelocity(clone.vx, clone.vy);

    clone.setPosition(
      MAP_OFFSET + clone.mapX*TILE_LENGTH, 
      MAP_OFFSET + clone.mapY*TILE_LENGTH
    );

    clone.i = moves[clone.stepCount];

    if (clone.i != null) {
      clone.nextMapX = clone.mapX + directionMap[clone.i].vd[0];
      clone.nextMapY = clone.mapY + directionMap[clone.i].vd[1];

      let x1 = clone.mapX*TILE_LENGTH + MAP_OFFSET;
      let y1 = clone.mapY*TILE_LENGTH + MAP_OFFSET;
      let x2 = clone.nextMapX*TILE_LENGTH + MAP_OFFSET;
      let y2 = clone.nextMapY*TILE_LENGTH + MAP_OFFSET;
      drawArrow(g, x1, y1, x2, y2);
    
    }

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
    nextMapY: 0,
    i: 0,
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

    player.setPosition(
      MAP_OFFSET + mapX*TILE_LENGTH,
      MAP_OFFSET + mapY*TILE_LENGTH
    );

    if (moves.length % cloneLateFactor == 0 && cloneCount < cloneLimit) spawnClone();

    stopClonesFromMoving();

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
          
      nextMapX += xAxis;
      nextMapY += yAxis;

      tile = layer.getTileAtWorldXY(nextMapX*TILE_LENGTH, nextMapY*TILE_LENGTH);
      if (tile && tile.canCollide) {
        console.log(tile);
        nextMapX = mapX;
        nextMapY = mapY;
      } else { 
        console.log(null);
        [vx, vy] = [v*xAxis, v*yAxis];
        player.setVelocity(vx,vy);
      }

      moveClonesFromInput();

      g.clear();
      g.lineStyle(4, 0xff0000, 1);
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

    layer = map.createDynamicLayer('Ground', tileset, 0, 0).setScale(2);
    layer.setCollisionBetween(15, 16);

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

    g = this.add.graphics();
    g.lineStyle(4, 0xff0000, 1);

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