import 'phaser-ce';
import Pane from '../objects/Pane';
import SpeechService from '../services/SpeechService';
import GameText from '../objects/GameText';

// FIXME: Need to expose this as part of the game object
// so it is available to every service
const DEFAULT_RES = 32;
const sprites = {
    HORIZONTAL_BOTTOM: 'pane 0.ase',
    HORIZONTAL_TOP: 'pane 1.ase',
    VERTICAL_RIGHT: 'pane 2.ase',
    VERTICAL_LEFT: 'pane 3.ase',
    TOP_LEFT: 'pane 4.ase',
    BOTTOM_RIGHT: 'pane 5.ase',
    BOTTOM_LEFT: 'pane 6.ase',
    TOP_RIGHT: 'pane 7.ase'
};

export default class TextPane extends Phaser.Sprite {
    protected paneWidth: number;
    protected paneHeight: number;
    protected gameText: GameText;
    protected res: number;
    private pane: Pane;

    constructor (
        game: Phaser.Game,
        text: string = '',
        x: number = 0,
        y: number = 0,
        width: number = (game.width / DEFAULT_RES),
        height: number = 5,
        res: number = DEFAULT_RES,
        background: number = 0x000000
    ) {
        super(game, x, y, null);

        // Set pane dimensions and resolution
        this.paneWidth = width;
        this.paneHeight = height;
        this.res = res;

        // Create new Pane instance
        this.pane = new Pane(game, sprites, this.res, this.paneWidth, this.paneHeight, background);

        // Create text and position
        this.gameText = new GameText(game, '', { fontSize: this.res / 2 });
        this.gameText.wordWrap = true;
        this.gameText.lineSpacing = 5;
        this.gameText.y += this.res;
        this.gameText.x += this.res;
        this.gameText.wordWrapWidth = (this.paneWidth * this.res) - (this.res * 1.5);
        this.gameText.text = text;

        // Attach objects
        this.addChild(this.pane);
        this.addChild(this.gameText);
    }

    public updateText (
        text: string
    ): void {
        // Update text vaule
        this.gameText.text = text;
    }

    public setPosition (
        game: Phaser.Game,
        position: 'TOP'|'BOTTOM'|'BOTTOM_RIGHT'|'TOP_RIGHT'
    ): void {
        // Set TextPane position from a set of default values
        switch (position) {
            case 'TOP':
                this.x = 0;
                this.y = 0;
                break;
            case 'BOTTOM':
                this.x = 0;
                this.y = game.height - (this.paneHeight * this.res);
                break;
            case 'BOTTOM_RIGHT':
                this.x = game.width - (this.paneWidth * this.res);
                this.y = game.height - (this.paneHeight * this.res);
                break;
            case 'TOP_RIGHT':
                this.x = game.width - (this.paneWidth * this.res);
                this.y = 0;
                break;
        }
    }
}
