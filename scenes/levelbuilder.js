import Player from "../classes/player.js";
import Clone from "../classes/clone.js";
import TileOverlay from "../classes/tileOverlay.js";

import { tileGroups, tileRecipes } from "../data/autotileData.js";
import { vectorMap, moveInputs } from "../data/moveData.js";

import Keys from "../classes/keys.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 16;

export default class LevelBuilder extends Phaser.Scene {
    constructor() {
        super('levelBuilder');

        this.startX = 1;
        this.startY = 1;

        this.check;

        this.storedLevel;
        this.storedLayer; 
        this.i;

        this.tile;
        this.tileGroup;
        this.recipe;
        this.edgeTile;

        this.cloneLateFactor = 3;

        this.spawning = 0;

    }

    create() {    
        this.sound.stopAll();

        this.map = this.make.tilemap({key: 'build'});
        this.tileset = this.map.addTilesetImage('spritefusion', 'tileset');

        this.background = this.map.createDynamicLayer('Background', this.tileset, 0, 0);
        this.ground = this.map.createDynamicLayer('Ground', this.tileset, 0, 0);
        this.foreground = this.map.createDynamicLayer('Foreground', this.tileset, 0, 0);

        this.g = this.add.graphics()
        this.g.lineStyle(4, 0xffffff, 1);

        this.ground.setCollision([9,10,13,14,15,16,17,18], true);
        this.foreground.setCollision([9,10,13,14,15,16,17,18], true);

        this.layerList = [this.background, this.ground, this.foreground];

        this.player = new Player(this, this.startX, this.startY);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.foreground);

        this.cloneGroup = this.add.group();
        this.physics.add.collider(this.cloneGroup, this.ground);
        this.physics.add.collider(this.cloneGroup, this.foreground);
        this.cloneList = [];

        this.physics.add.overlap(this.player, this.cloneGroup, (p, c) => {
            p.setVelocity(0,0);
            
            p.setPosition(
                16 + p.mapX*TILE_LENGTH, 
                10 + p.mapY*TILE_LENGTH
            );
            
            [p.nextMapX, p.nextMapY] = [p.mapX, p.mapY];

            c.isBashed = true;
            c.setVelocity(0,0);
            c.setPosition(
                16 + c.lastMapX*TILE_LENGTH, 
                8 + c.lastMapY*TILE_LENGTH
            );
        });

        this.physics.add.overlap(this.cloneGroup, this.cloneGroup, (c1, c2) => {
            [c1, c2].forEach((clone) => {    
                clone.isBashed = true;
                clone.setVelocity(0,0);
                clone.setPosition(
                    16 + clone.lastMapX*TILE_LENGTH, 
                    8 + clone.lastMapY*TILE_LENGTH
                );
            });
        });

        this.tileOverlay = new TileOverlay(this, 0, 0);

        this.music = this.sound.add('playMusic', {
            rate: 1.0,
            volume: 0.5,
            loop: true
        });

        this.notPlayed = true;

        this.keys = new Keys(this);

        this.textLayer = this.add.text(0, 0, "").setDepth(99999999);
        this.textAutotile = this.add.text(0, 16, "").setDepth(99999999);
        this.textStart = this.add.text(0, 32, "").setDepth(99999999);
        this.textSpawning = this.add.text(0, 48, "").setDepth(99999999);
        this.textCloneLate = this.add.text(0, 64, "").setDepth(99999999);
        this.textEndBlue = this.add.text(256, 0, "").setDepth(99999999);
        this.textEndPurple = this.add.text(256, 16, "").setDepth(99999999);

        this.startSpeech();

    }

    startSpeech() {
        console.log(`
-- Contrôle du mode Level Builder! --
    0 à 6 = Changer de tuile
    Espace = Placer une tuile
    E = Copier une tuile
    L = Changer de "layer"
    
    A = Activer/Désactiver l'arrangement de tuile automatique
    S = Activer/Désactiver l'apparition de clone
    M = Définir la position de commencement du joueur/clone à la souris
    I-K = Augmenter/Diminuer le décalage du clone
    R = Réinitialiser le joueur/clone

    Q = Copier le niveau dans le presse-papier


  - Points techniques -
    Les collisions sur le "layer" 1 seront toujours désactivées
    Un seul téléporteur de chaque couleur peut être posé
    Les portes peuvent être placés seulement après avoir placé un bouton de sa couleur
        `);
    }

    drawArrow(x1, y1, x2, y2, headLength = 10) {
        this.g.lineBetween(x1, y1, x2, y2);

        const angle = Math.atan2(y2 - y1, x2 - x1);

        const leftX  = x2 - headLength * Math.cos(angle - Math.PI / 5);
        const leftY  = y2 - headLength * Math.sin(angle - Math.PI / 5);
        const rightX = x2 - headLength * Math.cos(angle + Math.PI / 5);
        const rightY = y2 - headLength * Math.sin(angle + Math.PI / 5);

        this.g.lineBetween(x2, y2, rightX, rightY);
        this.g.lineBetween(x2, y2, leftX, leftY);
    }

    checkCollisionAtSquare(x, y, layer) {
        this.check = layer.getTileAt(x, y);
        return this.check && this.check.canCollide;
    }

    copyLevel() {
        this.storedLevel = `
    {
        "id": 1,
        "name": "Ground",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
            ${this.copyLayer(this.ground)}
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false,
            "cloneLateFactor": ${this.cloneLateFactor},
            "startX": ${this.startX},
            "startY": ${this.startY},
            "exit1X": ${this.tileOverlay.exitBlueX},
            "exit1Y": ${this.tileOverlay.exitBlueY},
            "exit2X": ${this.tileOverlay.exitPurpleX},
            "exit2Y": ${this.tileOverlay.exitPurpleY}
            }
        ]
    }, {
        "id": 2,
        "name": "Foreground",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
            ${this.copyLayer(this.foreground)}
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false
            }
        ]
    }, {
        "id": 3,
        "name": "Background",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
            ${this.copyLayer(this.background)}
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false
            }
        ]
    }
    `;

        navigator.clipboard.writeText(this.storedLevel);
        console.log('-- Niveau copié! --')
    }

    copyLayer(layer) {
        this.storedLayer = "";
        this.i;

        for (let y = 0; y < layer.layer.height; y++) {
            for (let x = 0; x < layer.layer.width; x++) {
                this.i = layer.layer.data[y][x].index;
                if (this.i < 0) this.i = 0;

                this.storedLayer += (this.i + ",");
            }
        }

        this.storedLayer = this.storedLayer.slice(0,-1);

        return this.storedLayer;

    }

    update(time) {
        if (this.notPlayed) {
            this.music.play();
            this.notPlayed = false;
        }

        this.textLayer.setText(`Layer: ${this.tileOverlay.layer}`);
        this.textAutotile.setText(`Autotile: ${this.tileOverlay.autotile == 1}`);
        this.textStart.setText(`Start coords: ${this.startX}, ${this.startY}`);
        this.textSpawning.setText(`Spawning: ${this.spawning == 1}`);
        this.textCloneLate.setText(`Clone interval shift: ${this.player.cloneLateFactor}`);

        this.textEndBlue.setText(`Blue teleporter: ${this.tileOverlay.exitBlueX}, ${this.tileOverlay.exitBlueY}`);
        this.textEndPurple.setText(`Purple teleporter: ${this.tileOverlay.exitPurpleX}, ${this.tileOverlay.exitPurpleY}`);

        this.player.update(time, this.layerList);

        this.tileOverlay.update(time);

        if (this.keys.isQ()) {
            this.copyLevel();
        }

        if (this.keys.isS()) {
            this.spawning = 1 - this.spawning;
        }

        if (this.keys.isM()) {
            this.startX = this.tileOverlay.gridX;
            this.startY = this.tileOverlay.gridY;

            this.player.startX = this.startX;
            this.player.startY = this.startY;
        }

        if (this.keys.isI()) {
            this.cloneLateFactor += 1;
            if (this.cloneLateFactor > 8) this.cloneLateFactor = 8;
            this.player.cloneLateFactor = this.cloneLateFactor;
        }

        if (this.keys.isK()) {
            this.cloneLateFactor -= 1;
            if (this.cloneLateFactor < 1) this.cloneLateFactor = 1;
            this.player.cloneLateFactor = this.cloneLateFactor;
        }

        if (this.keys.isR()) {
            this.player.resetPosition(this.startX, this.startY);
            this.player.cloneCount = 0;
            moveInputs.length = 0;

            this.player.resetClone();
            this.cloneGroup.clear(true, true);
            this.cloneList.length = 0;

            this.tileOverlay.resetAllDoors();

            this.g.clear();
        }

        if (this.keys.isEsc()) {
            this.scene.switch('menuScreen');
        }

    } 

}