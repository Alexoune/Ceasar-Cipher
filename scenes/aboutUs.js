import TransitionOverlay from "../classes/transitionOverlay.js";
import EngineText from "../classes/engineText.js";

import Keys from "../classes/keys.js";

export default class AboutUs extends Phaser.Scene {
    constructor() {
        super('aboutUs');
    }

    create() {   
        this.sound.stopAll(); 

        this.engineText = new EngineText(this);

        this.engineText.clearLetters();

        this.engineText.drawPhrase(16, 16, "bande-son", 0);
        this.engineText.drawPhrase(32, 32, "alfred lajeunesse", 0);

        this.engineText.drawPhrase(16, 64, "code", 0);
        this.engineText.drawPhrase(32, 80, "alexy rasavady", 0);
        this.engineText.drawPhrase(32, 96, "alfred lajeunesse", 0);

        this.engineText.drawPhrase(16, 128, "conception des niveaux", 0);
        this.engineText.drawPhrase(32, 144, "lorick breton", 0);
        this.engineText.drawPhrase(32, 160, "félix bolduc", 0);

        this.engineText.drawPhrase(16, 192, "visuels", 0);
        this.engineText.drawPhrase(32, 208, "félix bolduc", 0);
        this.engineText.drawPhrase(32, 224, "alexy rasavady", 0);

        this.engineText.drawPhrase(16, 342, "musiques avec droits d'auteur", 0);
        this.engineText.drawPhrase(32, 358, "song of the century - green day", 0);
        this.engineText.drawPhrase(32, 374, "last night on earth - green day", 0);
        this.engineText.drawPhrase(32, 390, "mr brightside - the killers", 0);

        this.engineText.drawPhrase(366, 16, "tests", 0);
        this.engineText.drawPhrase(382, 32, "lorick breton", 0);
        this.engineText.drawPhrase(382, 48, "alexy rasavady", 0);
        this.engineText.drawPhrase(382, 64, "félix bolduc", 0);
        this.engineText.drawPhrase(382, 80, "alfred lajeunesse", 0);

        this.engineText.drawPhrase(366, 112, "remerciements à", 0);
        this.engineText.drawPhrase(382, 128, "corinne philippon", 0);
        this.engineText.drawPhrase(382, 144, "william desmarais", 0);
        this.engineText.drawPhrase(382, 160, "simon joly", 0);
        this.engineText.drawPhrase(382, 176, "loic fillion", 0);
        this.engineText.drawPhrase(382, 192, "arthur larente", 0);
        this.engineText.drawPhrase(382, 208, "copilot", 0);


        this.black = new TransitionOverlay(this, 0, 0, 1, 1000000000000000000000000000000000000000);
        this.black.setScale(10);

        this.keys = new Keys(this);

        this.black.fadeIn(500);

    }

    update(time) {
        this.time.delayedCall(500, () => {
            if (this.keys.isEsc() || this.keys.isUp() || this.keys.isSpace(false)) {
                this.black.fadeOut(500);

                this.time.delayedCall(500, () => {
                    this.scene.restart();
                    this.scene.switch('menuScreen');
                });
            }
        });

    }

}