import 'phaser-ce';
import '../../assets/sheets/catalogue/catalogue.json';
import '../../assets/sheets/catalogue/catalogue.png';
import '../../assets/sheets/products/products@4x.json';
import '../../assets/sheets/products/products@4x.png';
import '../../assets/sheets/pane/pane.png';
import '../../assets/sheets/pane/pane.json';
import Catalogue from '../objects/Catalogue';
import introStoreCatalogue from '../data/catalogues/introCatalogue';
import GameText from '../objects/GameText';
import WalletService from '../services/WalletService';
import PlayerService from '../services/PlayerService';
import Balance from '../objects/Balance';
import Pane from '../objects/Pane';
import TextPane from '../objects/TextPane';
import SelectPane from '../objects/SelectPane';
import { SelectItem } from '../interfaces/SelectPane';

export default class IntroStoreState extends Phaser.State {
    private select: SelectPane;
    private catalogue: Catalogue;
    private wallet: WalletService;
    private balance: Balance;

    constructor (
        private player: PlayerService
    ) {
        super();
    }

    public preload (
        game: Phaser.Game
    ) {
        // load sprite atlas'
        game.load.atlas('pane', 'pane.png', 'pane.json');
        game.load.atlas('catalogue', 'catalogue.png', 'catalogue.json');
        game.load.atlas('products', 'products@4x.png', 'products@4x.json');
    }

    public create (
        game: Phaser.Game
    ) {
        // Create new Catalogue instance using the INTRO catalogue
        this.catalogue = new Catalogue(game, this.player.getItemsById('INTRO'));
        // Create new SelectPane for buy / sell actions
        this.select = new SelectPane(game, [this.getSelectItem()]);
        // Create new Balance for diaplyaing player money
        this.balance = new Balance(game);
        // Update Balance to display player wallet balance
        this.balance.setText(this.player.printWalletBalance());

        // Create catalogue object
        // TODO: this could become part of the Catalogue costructor
        this.catalogue.create(game);

        // Adjust catalogue arrows to account for buy UI
        this.catalogue.setArrowPositionY(1);

        // Position Select Pane
        this.select.setPosition(game, 'TOP_RIGHT');

        // Add objects to scene
        game.add.existing(this.balance);
        game.add.existing(this.catalogue);
        game.add.existing(this.select);

        // Handle user input
        game.input.keyboard.onDownCallback = () => {
            // Update Select state and return active item
            const item: SelectItem = this.select.handleKeyDown(game);

            // Update Catalogue state
            this.catalogue.handleKeyDown(game);

            switch (game.input.keyboard.event.keyCode) {
                case Phaser.Keyboard.ENTER:
                    // Handle Select actions
                    switch (item.action) {
                        case 'BUY_ITEM':
                            // Buy the active item
                            this.player.buyItem(this.catalogue.getCatalogueId(), this.catalogue.getActiveItem());
                            break;
                        case 'SELL_ITEM':
                            // Sell the active item
                            this.player.sellItem(this.catalogue.getCatalogueId(), this.catalogue.getActiveItem());
                            break;
                    }

                    // Update the Balance once and item has been bought / sold
                    this.balance.setText(this.player.printWalletBalance());
                    // Update Select state once an item has been bought / sold
                    this.select.updateItems(game, [this.getSelectItem()]);
                    break;
                case Phaser.Keyboard.LEFT:
                case Phaser.Keyboard.RIGHT:
                    // Update Select state relative to active item
                    this.select.updateItems(game, [this.getSelectItem()]);
                    break;
            }
        };

        game.input.keyboard.onUpCallback = () => {
            // Update Catalogue state
            this.catalogue.handleKeyUp();
        };
    }

    public update (
        game: Phaser.Game
    ) {}

    private getSelectItem (): SelectItem {
        // Determine if the active item is owned by the user
        const owned: boolean = this.player.ownsItem(this.catalogue.getCatalogueId(), this.catalogue.getActiveItem());

        // Return a SelectItem with the correct state based on ownership
        return {
            value: owned ? 'SELL' : 'BUY',
            action: owned ? 'SELL_ITEM' : 'BUY_ITEM'
        };
    }
}
