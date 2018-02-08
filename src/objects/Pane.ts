import 'phaser-ce';

export default class Pane extends Phaser.Sprite {
    private verticalHeight: number;
    private horizontalWidth: number;
    private paneHeight: number;
    private paneWidth: number;

    constructor (
        game: Phaser.Game,
        spriteRefs: any,
        res: number,
        width: number = 16,
        height: number = 5,
        background: number = 0x000000
    ) {
        super(game, 0, 0, null);

        // Set actual pane dimensions
        this.paneWidth = width * res;
        this.paneHeight = height * res;
        this.verticalHeight = this.paneHeight - (res * 2);
        this.horizontalWidth = this.paneWidth - (res * 2);

        // Create pane background
        const backgroundGraphics = new Phaser.Graphics(game);

        backgroundGraphics.beginFill(background);
        backgroundGraphics.drawRect(0, 0, this.paneWidth, this.paneHeight);

        this.addChild(backgroundGraphics);

        // Build pane

        if (this.horizontalWidth) {
            // top
            for (let i = res; i <= this.horizontalWidth; i += res) {
                this.addChild(new Phaser.Sprite(
                    game, i, 0, 'pane', spriteRefs.HORIZONTAL_TOP
                ));
            }

            // bottom
            for (let i = res; i <= this.horizontalWidth; i += res) {
                this.addChild(new Phaser.Sprite(
                    game, i, this.verticalHeight + res, 'pane', spriteRefs.HORIZONTAL_BOTTOM
                ));
            }
        }

        if (this.verticalHeight) {
            // left
            for (let i = res; i <= this.verticalHeight; i += res) {
                this.addChild(new Phaser.Sprite(
                    game, 0, i, 'pane', spriteRefs.VERTICAL_LEFT
                ));
            }

            // right
            for (let i = res; i <= this.verticalHeight; i += res) {
                this.addChild(new Phaser.Sprite(
                    game, (width * res) - res, i, 'pane', spriteRefs.VERTICAL_RIGHT
                ));
            }
        }

        const topRightCorner = new Phaser.Sprite(
            game, (width * res) - res, 0, 'pane', spriteRefs.TOP_RIGHT
        );
        const topLeftCorner = new Phaser.Sprite(
            game, 0, 0, 'pane', spriteRefs.TOP_LEFT
        );
        const bottomLeftCorner = new Phaser.Sprite(
            game, 0, (height * res) - res, 'pane', spriteRefs.BOTTOM_LEFT
        );
        const bottomRightCorner = new Phaser.Sprite(
            game, (width * res) - res, (height * res) - res, 'pane', spriteRefs.BOTTOM_RIGHT
        );

        this.addChild(topLeftCorner);
        this.addChild(topRightCorner);
        this.addChild(bottomLeftCorner);
        this.addChild(bottomRightCorner);
    }
}
