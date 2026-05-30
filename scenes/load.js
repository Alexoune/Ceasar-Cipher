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

        this.load.image('Logo', 'assets/logo.png');

        this.load.image('stick', 'assets/stick.png');
        this.load.image('cube', 'assets/cube.png');
        this.load.image('hitbox', 'assets/hitbox.png');

        this.load.image('black', 'assets/black-canvas.png');
        
        this.load.image('tileset', 'assets/tilesheet.png');
        this.load.tilemapTiledJSON('build', 'assets/tilemaps/build.json');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');

        this.load.audio('songStart', 'assets/musiques/Song-of-the-Century.mp3');

        this.load.audio('suddenStop', 'assets/sound_effects/sudden-stop.mp3');
        this.load.audio('game_over_static', 'assets/sound_effects/radio-static-cb.mp3');

        this.load.spritesheet('lapin_sang','assets/animations/blood_lapin.png', { frameWidth:24, frameHeight:32});
        this.load.spritesheet('lapin_orange','assets/animations/orange_lapin.png', { frameWidth:24, frameHeight:32});
        this.load.spritesheet('lapin_vert','assets/animations/vert_lapin.png', { frameWidth:24, frameHeight:32});

        this.load.spritesheet('lapin_game_over','assets/animations/lapin_static.png', { frameWidth:24, frameHeight:32});

        this.load.spritesheet('tv_man','assets/animations/tv_guy.png', { frameWidth:64, frameHeight:32});

    }

    create() {    
        // Lapin couleur sang
        this.anims.create({
            key: 'lapin_sang_left', // Unique clef d'identité
            frames: this.anims.generateFrameNumbers('lapin_sang', { start: 0, end: 3 }),
            frameRate: 8, // Frames montrées per seconde
            repeat: -1
        });

        this.anims.create({
            key: 'lapin_sang_down',
            frames: this.anims.generateFrameNumbers('lapin_sang', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_sang_right',
            frames: this.anims.generateFrameNumbers('lapin_sang', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_sang_up',
            frames: this.anims.generateFrameNumbers('lapin_sang', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1 
        });


        // Lapin couleur orange
        this.anims.create({
            key: 'lapin_orange_left',
            frames: this.anims.generateFrameNumbers('lapin_orange', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'lapin_orange_down',
            frames: this.anims.generateFrameNumbers('lapin_orange', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_orange_right',
            frames: this.anims.generateFrameNumbers('lapin_orange', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_orange_up',
            frames: this.anims.generateFrameNumbers('lapin_orange', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1 
        });


        // Lapin couleur verte
        this.anims.create({
            key: 'lapin_vert_left',
            frames: this.anims.generateFrameNumbers('lapin_vert', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'lapin_vert_down',
            frames: this.anims.generateFrameNumbers('lapin_vert', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_vert_right',
            frames: this.anims.generateFrameNumbers('lapin_vert', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1 
        });

        this.anims.create({
            key: 'lapin_vert_up',
            frames: this.anims.generateFrameNumbers('lapin_vert', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1 
        });


        // Animation statique pour l'écran Game Over / Intro
        this.anims.create({
            key: 'lapin_game_over',
            frames: this.anims.generateFrameNumbers('lapin_game_over', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.switch('menuScreen');
    }

}