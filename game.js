import Titre from './scenes/titre.js';
import MenuScreen from "./scenes/menuscreen.js";
import AboutUs from "./scenes/aboutUs.js";
import Load from "./scenes/load.js";
import Story from './scenes/story.js';
import LevelBuilder from './scenes/levelbuilder.js';

import Player from './classes/player.js';

const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 320;
const TILE_LENGTH = 32;
const MAP_OFFSET = 16;

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

function checkCollisionAtSquare(x,y) {
  tile = layer.getTileAtWorldXY(x*TILE_LENGTH, y*TILE_LENGTH);
  return tile && tile.canCollide;
}

function pushMoveFromVelocity(vx, vy) {
  directionMap.forEach(d => {
    if(d.check({ vx, vy })) moves.push(d.dir);
  });
}

function pushCloneInterraction() {
  cloneToPush = null;

  cloneGroup.children.each(function (clone) {    
    if(clone.mapX == nextMapX && clone.mapY == nextMapY && clone.isCollide) {
      cloneToPush = clone;
    }
  });

  if(cloneToPush) {
    let pushX = cloneToPush.mapX + xAxis;
    let pushY = cloneToPush.mapY + yAxis;
    if(!checkCollisionAtSquare(pushX, pushY)) {
      cloneToPush.vx = (cloneToPush.nextMapX - cloneToPush.mapX)*v;
      cloneToPush.vy = (cloneToPush.nextMapY - cloneToPush.mapY)*v;
      console.log(cloneToPush.nextMapX - cloneToPush.mapX, cloneToPush.nextMapY - cloneToPush.mapY);

      cloneToPush.nextMapX = pushX;
      cloneToPush.nextMapY = pushY;

    } else {
      [nextMapX, nextMapY] = [mapX, mapY];
    }

    return
  }
    
  if (checkCollisionAtSquare(nextMapX, nextMapY)) {
    nextMapX = mapX;
    nextMapY = mapY;
  }

}

function moveClonesFromInput() {
  cloneGroup.children.each(function (clone) {
    clone.vx += (clone.nextMapX - clone.mapX)*v;
    clone.vy += (clone.nextMapY - clone.mapY)*v;

    if (checkCollisionAtSquare(clone.nextMapX, clone.nextMapY)) {
      clone.nextMapX = clone.mapX;
      clone.nextMapY = clone.mapY;
    }

    clone.lastMapX = clone.mapX;
    clone.lastMapY = clone.mapY;

    clone.mapX = clone.nextMapX;
    clone.mapY = clone.nextMapY;
    
    clone.setVelocity(clone.vx, clone.vy);

    clone.stepCount += 1;

  });
}

function stopClonesFromMoving() {
  cloneGroup.children.each(function (clone) {
    clone.i = moves[clone.stepCount];
    if(clone.isBashed) {
      clone.mapX = clone.lastMapX;
      clone.mapY = clone.lastMapY;
    }
    clone.isBashed = false;
    clone.isCollide = false;

    clone.nextMapX = clone.mapX + directionMap[clone.i].vd[0];
    clone.nextMapY = clone.mapY + directionMap[clone.i].vd[1];

    let x1 = clone.mapX*TILE_LENGTH + MAP_OFFSET;
    let y1 = clone.mapY*TILE_LENGTH + MAP_OFFSET;
    let x2 = clone.nextMapX*TILE_LENGTH + MAP_OFFSET;
    let y2 = clone.nextMapY*TILE_LENGTH + MAP_OFFSET;
    drawArrow(g, x1, y1, x2, y2);

    if (checkCollisionAtSquare(clone.nextMapX, clone.nextMapY)) {
      clone.isCollide = true;
    }

    clone.vx = 0; 
    clone.vy = 0;
    clone.setVelocity(clone.vx, clone.vy);

    clone.setPosition(
      MAP_OFFSET + clone.mapX*TILE_LENGTH, 
      MAP_OFFSET + clone.mapY*TILE_LENGTH
    );

  });

}

function spawnClone() {
  cloneCount += 1;

  clone = cloneGroup.create(
    MAP_OFFSET + startX*TILE_LENGTH,
    MAP_OFFSET + startY*TILE_LENGTH,
    'hitbox'
  );

  Object.assign(clone, {
    vx: 0,
    vy: 0,
    mapX: startX,
    mapY: startY,
    stepCount: 0,
    nextMapX: 0,
    nextMapY: 0,
    lastMapX: 0,
    lastMapY: 0,
    i: 0,
    // Condition
    isBashed: false,
    isCollide: false,
  });

  clone.setScale(2);
  clone.body.setSize(8,8);
  clone.body.setOffset(0,0); 
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
      [vx, vy] = [v*xAxis, v*yAxis];

      pushCloneInterraction();

      moveClonesFromInput();

      player.setVelocity(vx,vy);

      g.clear();
      g.lineStyle(4, 0xffffff, 1);
    }
  } else {
    pressed = false;
  }
}

class Test extends Phaser.Scene {
  preload() {
    this.load.image('stick', 'assets/stick.png');

    this.load.image('hitbox', 'assets/hitbox.png');

    this.load.image('tiles', 'assets/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');

  }

  create() {    
    g = this.add.graphics();
    g.lineStyle(4, 0xffffff, 1);

    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('spritefusion', 'tiles');

    layer = map.createDynamicLayer('Ground', tileset, 0, 0).setScale(2);
    layer.setCollisionBetween(15, 16);

    this.player = new Player(this, startX, startY);
    this.physics.add.collider(this.player, layer);

    /*cloneGroup = this.physics.add.group();
    this.physics.add.collider(cloneGroup, layer);

    this.physics.add.overlap(player, cloneGroup, (p, c) => {
      p.setVelocity(0,0);
      p.setPosition(
        MAP_OFFSET + mapX*TILE_LENGTH, 
        MAP_OFFSET + mapY*TILE_LENGTH
      );
      [nextMapX, nextMapY] = [mapX, mapY];

      c.isBashed = true;
      c.setVelocity(0,0);
      c.setPosition(
        MAP_OFFSET + c.lastMapX*TILE_LENGTH, 
        MAP_OFFSET + c.lastMapY*TILE_LENGTH
      );
    });
    
    this.physics.add.overlap(cloneGroup, cloneGroup, (c1, c2) => {
      [c1, c2].forEach((clone) => {    
        clone.isBashed = true;
        clone.setVelocity(0,0);
        clone.setPosition(
          MAP_OFFSET + clone.lastMapX*TILE_LENGTH, 
          MAP_OFFSET + clone.lastMapY*TILE_LENGTH
        );
      });
    });*/

    cursors = this.input.keyboard.createCursorKeys();

  }

  update(time) {
    this.player.update(time);
  } 

}

/*class LevelBuilder extends Phaser.Scene {
  preload() {
    this.load.image('stick', 'assets/stick.png');

    this.load.image('hitbox', 'assets/hitbox.png');

    this.load.image('tiles', 'assets/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');

  }

  create() {    
    g = this.add.graphics();
    g.lineStyle(4, 0xffffff, 1);

    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('spritefusion', 'tiles');

    layer = map.createDynamicLayer('Empty', tileset, 0, 0).setScale(2);
    layer.setCollisionBetween(15, 16);

    player = this.physics.add.sprite(
      MAP_OFFSET + TILE_LENGTH*mapX,
      MAP_OFFSET + TILE_LENGTH*mapY, 
      'hitbox'
    );
    player.setScale(2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, layer);

    cloneGroup = this.physics.add.group();
    this.physics.add.collider(cloneGroup, layer);
    
    this.physics.add.overlap(cloneGroup, cloneGroup, (c1, c2) => {
      c1.setVelocity(0,0);
      c2.setVelocity(0,0);

      c1.setPosition(MAP_OFFSET + c1.mapX*TILE_LENGTH, MAP_OFFSET + c1.mapY*TILE_LENGTH);
      c2.setPosition(MAP_OFFSET + c2.mapX*TILE_LENGTH, MAP_OFFSET + c2.mapY*TILE_LENGTH);

      console.log(c1.mapX, c1.mapY);
      console.log(c2.mapX, c2.mapY);
    });

    cursors = this.input.keyboard.createCursorKeys();

  }

  update(time) {
    if (moving) {
      whileMoving(time);
    } else {
      playerInput(time);
    }
    
  } 

}*/

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
  scene: [Load, Titre, MenuScreen, AboutUs, Story, LevelBuilder]
};

const game = new Phaser.Game(config);