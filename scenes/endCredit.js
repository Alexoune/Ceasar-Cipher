import TransitionOverlay from '../classes/transitionOverlay.js';
import EngineText from '../classes/engineText.js';

const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

export default class EndCredit extends Phaser.Scene {
    constructor() {
        super('endCredit');
    }

    create() {    
        this.bg_1 = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'night_sky');
        this.bg_1.setScale(2);

        this.scrollX = 100;

        this.startWaitTime = 0;

        //this.cloud = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'front_cloud');
        //this.cloud.setScale(2);

        this.fr_4 = this.add.tileSprite(0, -SCREEN_HEIGHT + SCREEN_HEIGHT/2 + 375, SCREEN_WIDTH, SCREEN_HEIGHT, 'night_back_city').setScale(1.5);
        this.fr_4.setOrigin(0, 0);
        this.fr_4.setScrollFactor(0);

        this.fr_3 = this.add.tileSprite(0, -SCREEN_HEIGHT + SCREEN_HEIGHT/2 + 350, SCREEN_WIDTH, SCREEN_HEIGHT, 'night_city').setScale(1.8);
        this.fr_3.setOrigin(0, 0);
        this.fr_3.setScrollFactor(0);

        this.fr_2 = this.add.tileSprite(0, -SCREEN_HEIGHT + SCREEN_HEIGHT/2 + 250, SCREEN_WIDTH/2, SCREEN_HEIGHT, 'front_cloud2').setScale(2);
        this.fr_2.setOrigin(0, 0);
        this.fr_2.setScrollFactor(0);

        this.fr_1 = this.add.tileSprite(0, -SCREEN_HEIGHT + SCREEN_HEIGHT/2 + 60, SCREEN_WIDTH/2, SCREEN_HEIGHT, 'front_cloud1').setScale(3);
        this.fr_1.setOrigin(0, 0);
        this.fr_1.setScrollFactor(0);

        this.letterList = "abcdefghijklmnopqrstuvwxyz ,.'?!éèê-àâôùûç";
        this.letterGroup = this.add.group();
        //this.letterGroup.clear(true, true);

        this.letterLength = 6;

        this.endMusic = this.sound.add('songCredits', {
            volume: 0.5 
        });

        this.endMusic.play();

        /*this.blackOverlay = new TransitionOverlay(this, 240, 160, 1);

        this.time.delayedCall(3000, () => {
            this.blackOverlay.fadeIn(4000);
        });*/

        this.engineText = new EngineText(this);

        /*this.engineText.drawPhrase(10, 10, "veuillez me serrer la pogne, dont!", 50);

        this.time.delayedCall(4000, () => {
            this.engineText.clearLetters();
        });*/
        
    }

    update(time, delta) {
        this.fr_1.tilePositionX += this.scrollX * delta / 1000;
        this.fr_2.tilePositionX += this.scrollX / 2 * delta / 1000;
        this.fr_3.tilePositionX += this.scrollX / 4 * delta / 1000;
        this.fr_4.tilePositionX += this.scrollX / 8 * delta / 1000;

    } 

}