import { CatalogueInterface } from '../../interfaces/catalogue';

const introStoreCatalogue: CatalogueInterface = {
    name: 'Suits Plus',
    items: [
        {
            id: 0,
            price: 40,
            name: 'The Penguin',
            description: 'Stay classy.',
            sprite: 'products 0.ase',
            locked: false
        },
        {
            id: 1,
            price: 5.99,
            name: 'The Everyday',
            description: 'The everyday suit, for everyday.',
            sprite: 'products 0.ase',
            locked: true
        }
    ]
};

export default introStoreCatalogue;
