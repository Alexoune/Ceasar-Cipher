import TransitionOverlay from '../classes/transitionOverlay.js';

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

        this.drawPhrase(10, 10, "pourquoi arrache-t-il mes entrailles!", 50);

        this.time.delayedCall(4000, () => {
            this.letterGroup.clear(true, true);
        });
        
    }

    drawPhrase(x, y, text, delay) {
        for (let i = 0; i < text.length; i++) {
            this.time.delayedCall(delay*i, () => {
                let idx = 0;

                switch (text[i]) {
                    case '?':
                        idx = this.letterList.indexOf('.');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('?');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 3, idx);
                        break;

                    case '!':
                        idx = this.letterList.indexOf('.');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('!');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 3, idx);
                        break;

                    case 'é':
                        idx = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('é');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'è':
                        idx = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'ê':
                        idx = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'à':
                        idx = this.letterList.indexOf('a');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'â':
                        idx = this.letterList.indexOf('a');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'ù':
                        idx = this.letterList.indexOf('u');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'û':
                        idx = this.letterList.indexOf('u');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'ô':
                        idx = this.letterList.indexOf('o');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, idx);
                        break;

                    case 'ç':
                        idx = this.letterList.indexOf('c');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);
                        idx = this.letterList.indexOf(',');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y + 4, idx);
                        break;
    
                    default:
                        idx = this.letterList.indexOf(text[i]);
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, idx);

                }

            });
        }

    }

    drawLetter(x, y, idx) {
        let letter = this.add.sprite(0, 0, 'letters', idx).setScale(2);
        letter.setPosition(x + letter.displayWidth/2, y + letter.displayHeight/2);
        this.letterGroup.add(letter);
    }

    update(time, delta) {
        this.fr_1.tilePositionX += this.scrollX * delta / 1000;
        this.fr_2.tilePositionX += this.scrollX / 2 * delta / 1000;
        this.fr_3.tilePositionX += this.scrollX / 4 * delta / 1000;
        this.fr_4.tilePositionX += this.scrollX / 8 * delta / 1000;

        
    } 

}