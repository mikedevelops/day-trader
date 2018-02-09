import {
    ProductInterface,
    CatalogueInterface,
    UserCatalogueInterface,
    UserProductInterface
} from '../interfaces/catalogue';

export default class PlayerItemService {
    /**
     * Master Collection of all catalogues
     */
    private master: UserCatalogueInterface[];

    /**
     * Player Item Service
     * @param master
     */
    constructor (
        master: CatalogueInterface[]
    ) {
        // Create a recursive clone of the master catalogue collection
        this.master = master.map((catalogue: CatalogueInterface) => {
            return Object.assign({}, catalogue, {
                products: catalogue.products.map((product: ProductInterface) => {
                    // Add locked & owned default values to products
                    return {
                        product: Object.assign({}, product),
                        locked: true,
                        owned: false
                    };
                })
            });
        });

        // default unlocks, FIXME: This could be done in a more efficient way,
        // possibly conifg driven, this will get out of hand at scale

        // Unlock the "The Everyday" by default
        this.master.find((catalogue: UserCatalogueInterface) => catalogue.id === 'INTRO')
            .products.find((item: UserProductInterface) => item.product.id === 0)
            .locked = false;
    }

    /**
     * Get a catalogue by ID
     * @param key
     */
    public getCatalogueById (
        key: string
    ): UserCatalogueInterface {
        // Get a catalogue by ID
        return this.master.find((catalogue: UserCatalogueInterface) => catalogue.id === key);
    }

    /**
     * Buy an item
     * @param catalogueId
     * @param item
     */
    public buy (
        catalogueId: string,
        item: UserProductInterface
    ) {
        // FIXME: fix duplication of buy/sell methods, these should invoke a private update method
        // that receives the new state diff and merges with the catalogue state

        // Create new set of products in catalogue with state changes
        // update catalogue with new product state
        this.getCatalogueById(catalogueId).products = this.getCatalogueById(catalogueId).products
            .map((catalgueItem: UserProductInterface) => {
                if (catalgueItem.product.id === item.product.id) {
                    return Object.assign({}, catalgueItem, {
                        owned: true
                    });
                }

                return catalgueItem;
            });
    }

    /**
     * Sell an item
     * @param catalogueId
     * @param item
     */
    public sell (
        catalogueId: string,
        item: UserProductInterface
    ) {
        // FIXME: fix duplication of buy/sell methods, these should invoke a private update method
        // that receives the new state diff and merges with the catalogue state

        // Create new set of products in catalogue with state changes
        // update catalogue with new product state
        this.getCatalogueById(catalogueId).products = this.getCatalogueById(catalogueId).products
            .map((catalgueItem: UserProductInterface) => {
                if (catalgueItem.product.id === item.product.id) {
                    return Object.assign({}, catalgueItem, {
                        owned: false
                    });
                }

                return catalgueItem;
            });
    }

    /**
     * Check if an item is owned by the current player
     * @param catalogueId
     * @param product
     */
    public owned (
        catalogueId: string,
        item: UserProductInterface
    ): boolean {
        return this.getCatalogueById(catalogueId).products.find((catalgueItem: UserProductInterface) => {
            return catalgueItem.product.id === item.product.id;
        }).owned;
    }
}
