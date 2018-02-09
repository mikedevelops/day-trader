import WalletService from './WalletService';
import PlayerItemService from './PlayerItemService';
import { CatalogueInterface, UserCatalogueInterface, UserProductInterface } from '../interfaces/catalogue';

export default class PlayerService {
    /**
     * Player Service
     * @param wallet
     * @param itemService
     * @param name
     */
    constructor (
        private wallet: WalletService,
        private itemService: PlayerItemService,
        private name: string = 'Player 1',
    ) {}

    /**
     * Get catalogue by ID
     * @param key
     */
    public getCatalogueById (
        key: string
    ): UserCatalogueInterface {
        return this.itemService.getCatalogueById(key);
    }

    /**
     * Buy item
     * @param catalogueId
     * @param item
     */
    public buyItem (
        catalogueId: string,
        item: UserProductInterface
    ) {
        // If an item is not locked and not owned,
        // buy the item and subtract the price from
        // the player wallet
        if (!item.locked && !item.owned) {
            this.itemService.buy(catalogueId, item);
            this.wallet.subtract(item.product.price);
        }
    }

    /**
     * Sell item
     * @param catalogueId
     * @param item
     */
    public sellItem (
        catalogueId: string,
        item: UserProductInterface
    ) {
        // If a item is owned by the player,
        // sell the item and add the item cost
        // to the player wallet
        // TODO: Should sold items be less valuable?
        if (item.owned) {
            this.itemService.sell(catalogueId, item);
            this.wallet.add(item.product.price);
        }
    }

    /**
     * Print wallet balance
     */
    public printWalletBalance (): string {
        return this.wallet.printBalance();
    }

    /**
     * Check if a player owns an item
     * @param catalogueId
     * @param product
     */
    public ownsItem (
        catalogueId: string,
        product: UserProductInterface
    ): boolean {
        return this.itemService.owned(catalogueId, product);
    }
}
