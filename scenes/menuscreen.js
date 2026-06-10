import Keys from "../classes/keys.js";

const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

export default class MenuScreen extends Phaser.Scene {
    constructor() {
        super('menuScreen');
    }

    create() {    
        this.sound.stopAll(); 

        this.counter = 0;

        this.bg = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'night_sky').setScale(2);

        this.playButton = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'menuButtons', 0);
        this.playButton.i = 0;

        this.editorButton = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 + 50, 'menuButtons', 1);
        this.editorButton.i = 1;

        this.aboutUsButton = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 + 100, 'menuButtons', 2);
        this.aboutUsButton.i = 2;

        this.buttonList = [this.playButton, this.editorButton, this.aboutUsButton];

        this.title = this.add.image(SCREEN_WIDTH/2, 100, 'titre');

        this.music = this.sound.add('menuMusic', {
            rate: 1.0,
            volume: 0.5,
            loop: true
        });

        this.notPlayed = true;
        
        this.keys = new Keys(this);
    }

    update(time) {
        this.title.y = 100 + Math.sin(time * 0.001) * 5;

        for (let b of this.buttonList) {
            if (this.counter == b.i) b.setScale(2);
            else b.setScale(1.5);
        }

        if (this.notPlayed) {
            this.music.play();
            this.notPlayed = false;
        }

        if (this.keys.isUp()) {
            this.counter -= 1;
            if (this.counter < 0) this.counter = this.buttonList.length - 1;
        }

        if (this.keys.isDown()) {
            this.counter += 1;
            if (this.counter > this.buttonList.length - 1) this.counter = 0;
        }

        if (this.keys.isEnter() || this.keys.isSpace(false)) {
            this.scene.restart();

            switch (this.counter) {
                case 0:
                    this.scene.switch('story');
                    break;
                case 1:
                    this.scene.switch('levelBuilder');
                    break;
                case 2:
                    this.scene.switch('aboutUs');
                    break;
            }
        }

    } 

}