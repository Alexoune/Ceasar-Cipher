export default class Keys {
    constructor(scene)  {
        this.scene = scene;

        this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.zero = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        this.one = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.two = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.three = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.four = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.five = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.six = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.seven = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.eight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        this.nine = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);


    }

    isRight() {
        return Phaser.Input.Keyboard.JustDown(this.right);
    }

    isLeft() {
        return Phaser.Input.Keyboard.JustDown(this.left);
    }

    isDown() {
        return Phaser.Input.Keyboard.JustDown(this.down);
    }

    isUp() {
        return Phaser.Input.Keyboard.JustDown(this.up);
    }

    isSpace() {
        return this.space.isDown;
    }

    isZero() { return Phaser.Input.Keyboard.JustDown(this.zero); }
    isOne() { return Phaser.Input.Keyboard.JustDown(this.one); }
    isTwo() { return Phaser.Input.Keyboard.JustDown(this.two); }
    isThree() { return Phaser.Input.Keyboard.JustDown(this.three); }
    isFour() { return Phaser.Input.Keyboard.JustDown(this.four); }
    isFive() { return Phaser.Input.Keyboard.JustDown(this.five); }
    isSix() { return Phaser.Input.Keyboard.JustDown(this.six); }
    isSeven() { return Phaser.Input.Keyboard.JustDown(this.seven); }
    isEight() { return Phaser.Input.Keyboard.JustDown(this.eight); }
    isNine() { return Phaser.Input.Keyboard.JustDown(this.nine); }


    
}