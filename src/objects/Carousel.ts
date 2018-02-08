import 'phaser-ce';
import CatalogueService from '../services/CatalogueService';
import { CatalogueInterface, UserCatalogueInterface, UserProductInterface } from '../interfaces/catalogue';
import Product from './Product';
import GameText from './GameText';

const sprites = {
    ARROW: 'catalogue.ase'
};

export default class Carousel extends Phaser.Sprite {
    protected background: Phaser.Graphics;
    protected catalogue: CatalogueService;
    protected topPadding: number;
    private rightArrow: Phaser.Sprite;
    private leftArrow: Phaser.Sprite;
    private item: Product;

    constructor (
        game: Phaser.Game,
        items: UserCatalogueInterface,
        private arrowScale: number = 1.5,
        width: number = game.width / 1.5,
        x: number = 0,
        y: number = 0
    ) {
        super(game, x, y);

        // Create new catalogue service for managing items
        this.catalogue = new CatalogueService(items);
    }

    public create (
        game: Phaser.Game
    ) {
        // Create arrow sprites
        this.leftArrow = new Phaser.Sprite(game, 0, 0, 'catalogue', sprites.ARROW);
        this.rightArrow = new Phaser.Sprite(game, 0, 0, 'catalogue', sprites.ARROW);

        // Create background which will give the Carousel it's bounds
        this.background = new Phaser.Graphics(game, 0, 0);

        // create left arrow from right arrow sprite
        this.leftArrow.rotation = Phaser.Math.degToRad(180);

        // set anchors for scaling from the center
        this.leftArrow.anchor.setTo(0.5);
        this.rightArrow.anchor.setTo(0.5);

        // Create new Product from the active item
        this.item = new Product(game, this.catalogue.getActiveProduct());

        // Add objects
        this.addChild(this.background);
        this.addChild(this.item);
        this.addChild(this.leftArrow);
        this.addChild(this.rightArrow);

        // Set background dimensions and fill
        this.background.beginFill(0x000000);
        // Make background fully transparent
        this.background.alpha = 0;
        // Draw background rect
        this.background.drawRect(0, 0, game.width, game.height / 2);

        // FIXME: This is the global res value hardcoded
        this.topPadding = 32;

        // Position carousel
        this.x = game.world.centerX - (this.background.width / 2);
        this.y = 0;

        // Arrow padding on the X axis from the edge of the bounding Background object
        const arrowPadding = 60;

        // Position arrows
        this.leftArrow.y = (this.background.height / 2) - (this.leftArrow.height / 2) + this.topPadding;
        this.leftArrow.x = (this.leftArrow.width / 2) + arrowPadding;
        this.rightArrow.y = (this.background.height / 2) - (this.rightArrow.height / 2) + this.topPadding;
        this.rightArrow.x = (this.background.width - (this.rightArrow.width / 2)) - arrowPadding;

        // Position product
        this.item.x = (this.background.width / 2) - (this.item.getDimensions().width / 2);
        this.item.y = this.topPadding * 1.5;
    }

    public handleKeyDown (
        game: Phaser.Game
    ) {
        switch (game.input.keyboard.event.keyCode) {
            case Phaser.Keyboard.LEFT:
                // Scale arrow up
                this.leftArrow.scale.setTo(this.arrowScale);
                // Get previous item
                this.catalogue.prev();
                break;
            case Phaser.Keyboard.RIGHT:
                // Scale arrow up
                this.rightArrow.scale.setTo(this.arrowScale);
                // Get next item
                this.catalogue.next();
                break;
            }

        // Update active product
        this.item.updateProduct(this.catalogue.getActiveProduct());
    }

    public handleKeyUp () {
        // Normalize arrow scale
        this.leftArrow.scale.setTo(1);
        this.rightArrow.scale.setTo(1);
    }

    public getActiveItem (): UserProductInterface {
        // Return active item
        return this.catalogue.getActiveProduct();
    }

    public setArrowPositionY (
        unit: number
    ) {
        // FIXME: add DEFAULT_RES to game maybe?
        // need to stop hardcoding 32 everywhere!
        this.leftArrow.y += (unit * 32);
        this.rightArrow.y += (unit * 32);
    }
}
