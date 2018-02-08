import Carousel from './Carousel';
import { CatalogueInterface, UserCatalogueInterface } from '../interfaces/catalogue';
import GameText from './GameText';
import TextPane from './TextPane';

export default class Catalogue extends Carousel {
    private descriptionPane: TextPane;
    private price: GameText;

    constructor (
        game: Phaser.Game,
        private userCatalogue: UserCatalogueInterface
    ) {
        super(game, userCatalogue);

        // Create price text
        this.price = new GameText(game, '', { align: 'center' });

        // Create description pane and set position
        this.descriptionPane = new TextPane(game);
        this.descriptionPane.setPosition(game, 'BOTTOM');

        // Add items
        this.addChild(this.price);
        this.addChild(this.descriptionPane);

        // Position price text
        this.price.y = this.background.height - (this.price.height / 2) + this.topPadding;
        this.price.x = this.background.width / 2;
        this.price.wordWrapWidth = 500;
        this.price.anchor.setTo(0.5);
    }

    public getCatalogueId (): string {
        // Return the current catatlogue ID
        return this.userCatalogue.id;
    }

    public update () {
        // Update description text and price
        this.descriptionPane.updateText(this.catalogue.printActiveProduct());
        this.price.text = this.catalogue.printActiveProductPrice();
    }
}
