import 'phaser-ce';
import TextPane from './TextPane';
import GameText from './GameText';
import { SelectItem } from '../interfaces/SelectPane';

const sprites = {
    SELECT_ARROW: 'pane 9.ase'
};

export default class SelectPane extends TextPane {
    private itemsWrapper: Phaser.Group;
    private selectArrow: Phaser.Sprite;

    /**
     * A TextPane that can contain selectabe items, used
     * for in-game menus
     * @param game
     * @param items
     * @param selected
     * @param width
     */
    constructor (
        game: Phaser.Game,
        private items: SelectItem[],
        private selected: number = 0,
        width: number = 5,
    ) {
        super(game, '', 0, 0, width, items.length + 2);

        // Create select arrow, this will indicate the active option
        this.selectArrow = new Phaser.Sprite(game, 0, 0, 'pane', sprites.SELECT_ARROW);
        this.selectArrow.x = this.res / 2;
        this.selectArrow.y = (0.65 * this.res);

        // Craete a wrapper for items so we can psition them a a group
        this.itemsWrapper = new Phaser.Group(game);

        // Add objects
        this.addChild(this.selectArrow);
        this.addChild(this.itemsWrapper);

        // Create and attach select items
        this.renderItems(game, items);

        // Position items
        this.itemsWrapper.y = this.res / 2;
    }

    /**
     * Increment selected item index
     */
    public moveSelectionDown (): void {
        if (this.selected < (this.items.length - 1)) {
            // Position arrow to indicate new selected item
            this.selectArrow.y += this.res;
            // Update active item index
            this.selected++;
        }
    }

    /**
     * Decrement selected item index
     */
    public moveSelectionUp (): void {
        if (this.selected > 0) {
            // Posituon arrow to indicate new selected item
            this.selectArrow.y -= this.res;
            // Update active item index
            this.selected--;
        }
    }

    /**
     * Handle Keyboard events
     * @param game
     */
    public handleKeyDown (
        game: Phaser.Game
    ): SelectItem {
        switch (game.input.keyboard.event.keyCode) {
            case Phaser.Keyboard.DOWN:
                // update selection on keypress
                this.moveSelectionDown();
                break;
            case Phaser.Keyboard.UP:
                // update selection on keypress
                this.moveSelectionUp();
                break;
            }

        return this.items[this.selected];
    }

    /**
     * Replace current selected items
     * with a new set
     * @param game
     * @param items
     */
    public updateItems (
        game: Phaser.Game,
        items: SelectItem[]
    ) {
        // Create and attach new items
        this.renderItems(game, items);
    }

    /**
     * Destroy existing items in wrapper and insert
     * new item set
     * @param game
     * @param items
     */
    private renderItems (
        game: Phaser.Game,
        items: SelectItem[]
    ) {
        // Remove & destroy exhisting children
        this.itemsWrapper.removeAll(true);
        // Update items
        this.items = items;
        // Create each item text and attach to wrapper
        this.items
            .forEach((item: SelectItem, index: number) => {
                const text = new GameText(game, item.value);

                // Position text relative to index
                text.y = (this.res / 2) + (index * this.res);
                // Left padding
                text.x = this.res * 2;

                this.itemsWrapper.addChild(text);
            });
    }
}
