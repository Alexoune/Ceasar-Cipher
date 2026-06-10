import TransitionOverlay from '../classes/transitionOverlay.js';
import EngineText from '../classes/engineText.js';

const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

export default class EndCredit extends Phaser.Scene {
    constructor() {
        super('endCredit');
    }

    create() {   
        this.sound.stopAll(); 
        
        this.bg_1 = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'night_sky');
        this.bg_1.setScale(2);

        this.scrollX = 100;

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

        this.letterLength = 6;

        this.endMusic = this.sound.add('songCredits', {
            rate: 1.0,
            volume: 0.5 
        });

        this.rate = this.endMusic.rate;

        this.endMusic.play();

        const delText = 5000;
        const delBwtn = 8500;

        this.entries = [
            { t:       0, text: "bande-son",            x: "center", y: 16 },
            { t: delText, text: "alfred lajeunesse",    x: 32,       y: 80 },
            { t: delText, clear: true },

            { t: delBwtn, text: "code",                 x: "center", y: 16 },
            { t: delText, text: "alexy rasavady",       x: 32,       y: 80 },
            { t: delText, text: "alfred lajeunesse",    x: 32,       y: 112 },
            { t: delText, clear: true },

            { t: delBwtn, text: "conception des niveaux", x: "center", y: 16 },
            { t: delText, text: "lorick breton",        x: 32,       y: 80 },
            { t: delText, text: "félix bolduc",         x: 32,       y: 112 },
            { t: delText, clear: true },

            { t: delBwtn, text: "visuels",              x: "center", y: 16 },
            { t: delText, text: "félix bolduc",         x: 32,       y: 80 },
            { t: delText, text: "alexy rasavady",       x: 32,       y: 112 },
            { t: delText, clear: true },

            { t: delBwtn, text: "tests",                x: "center", y: 16 },
            { t: delText, text: "lorick breton",        x: 32,       y: 80 },
            { t: delText, text: "alexy rasavady",       x: 32,       y: 112 },
            { t: delText, text: "félix bolduc",         x: 32,       y: 144 },
            { t: delText, text: "alfred lajeunesse",    x: 32,       y: 176 },
            { t: delText, clear: true },

            { t: delBwtn, text: "musiques avec droits d'auteur",     x: "center", y: 16 },
            { t: delText, text: "song of the century - green day",   x: 32,       y: 80 },
            { t: delText, text: "last night on earth - green day",   x: 32,       y: 112 },
            { t: delText, text: "mr brightside - the killers",       x: 32,       y: 144 },
            { t: delText, clear: true },

            { t: delBwtn, text: "remerciements à",      x: "center", y: 16 },
            { t: delText, text: "corinne philippon",    x: 32,       y: 80 },
            { t: delText, text: "william desmarais",    x: 32,       y: 112 },
            { t: delText, text: "simon joly",           x: 32,       y: 144 },
            { t: delText, text: "loic fillion",         x: 32,       y: 176 },
            { t: delText, text: "arthur larente",       x: 32,       y: 208 },
            { t: delText, text: "copilot",              x: 32,       y: 240 },
            { t: delText, clear: true },

            { t: delText, text: "merci d'avoir joué",   x: "center", y: SCREEN_HEIGHT/2 }
        ];

        this.blackOverlay = new TransitionOverlay(this, 240, 160, 1, 999999999999999999999999999999999999999);

        this.time.delayedCall(3000/this.rate, () => {
            this.blackOverlay.fadeIn(10000/this.rate);

            this.credits(13000/this.rate);
        });

        this.time.delayedCall(216000/this.rate, () => {
            this.blackOverlay.fadeOut(20000/this.rate);
        });

        this.time.delayedCall(236000/this.rate, () => {
            this.engineText.clearLetters();
            this.scene.restart();
            this.scene.switch('menuScreen');
        });

        this.engineText = new EngineText(this);

    }

    credits(delay) {
        this.text;
        this.xPos;

        this.current = 0;

        for (let entry of this.entries) {
            this.current += entry.t;

            this.time.delayedCall(this.current/this.rate + delay, () => {
                if (entry.clear) {
                    this.engineText.clearLetters();
                    return;
                }

                this.text = entry.text;
                if (entry.x == 'center') this.xPos = SCREEN_WIDTH/2 - this.text.length*(this.letterLength + 1);
                else this.xPos = entry.x;

                this.engineText.drawPhrase(this.xPos, entry.y, this.text, 6);
            });
        }

    }

    update(time, delta) {
        this.fr_1.tilePositionX += this.scrollX * delta / 1000;
        this.fr_2.tilePositionX += this.scrollX / 2 * delta / 1000;
        this.fr_3.tilePositionX += this.scrollX / 4 * delta / 1000;
        this.fr_4.tilePositionX += this.scrollX / 8 * delta / 1000;

    } 

}