export default class EngineText {
    constructor(scene) {
        this.scene = scene;

        this.letterList = "abcdefghijklmnopqrstuvwxyz ,.'?!éèê-àâôùûç";
        this.scene.letters = this.scene.add.group();
        this.letterLength = 6;

        this.i = 0;

    }

    drawPhrase(x, y, text, delay) {
        for (let i = 0; i < text.length; i++) {
            this.scene.time.delayedCall(delay*i, () => {
                switch (text[i]) {
                    case '?':
                        this.i = this.letterList.indexOf('.');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('?');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 3, this.i);
                        break;

                    case '!':
                        this.i = this.letterList.indexOf('.');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('!');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 3, this.i);
                        break;

                    case 'é':
                        this.i = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('é');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'è':
                        this.i = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'ê':
                        this.i = this.letterList.indexOf('e');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'à':
                        this.i = this.letterList.indexOf('a');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'â':
                        this.i = this.letterList.indexOf('a');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'ù':
                        this.i = this.letterList.indexOf('u');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('è');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'û':
                        this.i = this.letterList.indexOf('u');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'ô':
                        this.i = this.letterList.indexOf('o');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf('ê');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y - 4, this.i);
                        break;

                    case 'ç':
                        this.i = this.letterList.indexOf('c');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);
                        this.i = this.letterList.indexOf(',');
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y + 4, this.i);
                        break;
    
                    default:
                        this.i = this.letterList.indexOf(text[i]);
                        this.drawLetter(x + i*2*(this.letterLength + 1),  y, this.i);

                }

            });
        }

    }

    drawLetter(x, y, idx) {
        let letter = this.scene.add.image(0, 0, 'letters', idx)
            .setScale(2)
            .setDepth(100000000000000000000000000000001);
        letter.setPosition(x + letter.displayWidth/2, y + letter.displayHeight/2);
        this.scene.letters.add(letter);
    }

    drawKey(x, y, idx) {
        let key = this.scene.add.image(0, 0, 'keys', idx)
            .setScale(2)
            .setDepth(100000000000000000000000000000002);
        key.setPosition(x + key.displayWidth/2, y + key.displayHeight/2);
        this.scene.letters.add(key);
    }

    clearLetters() {
        this.scene.letters.clear(true, true);
    }

}