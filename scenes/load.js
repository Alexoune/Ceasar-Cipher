export default class AboutUs extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.load.image('Menu', 'assets/scenes/menuScreen.png');
        this.load.image('FlecheGauche', 'assets/scenes/flecheGauche.png');
        this.load.image('FlecheDroite', 'assets/scenes/flecheDroite.png');
        this.load.image('FlecheBas', 'assets/scenes/flecheBas.png');

        this.load.image('Background', 'assets/scenes/aboutUs.png');

        this.load.image('stick', 'assets/stick.png');
        this.load.image('cube', 'assets/cube.png');
        this.load.image('hitbox', 'assets/hitbox.png');

        this.load.image('tiles', 'assets/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');
        
        this.load.image('tileset', 'assets/tilesheet.png');
        this.load.tilemapTiledJSON('build', 'assets/tilemaps/build.json');
    }

    create() {    
        this.scene.switch('titre');
    }

}