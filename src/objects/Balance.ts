import 'phaser-ce';
import WalletService from '../services/WalletService';
import GameText from '../objects/GameText';

export default class Balance extends GameText {
    constructor (
        game: Phaser.Game
    ) {
        super(game, '');

        this.x = 10;
        this.y = 10;
    }
}
