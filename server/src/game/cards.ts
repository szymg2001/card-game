import { Card } from './game.dto';

export class Cards {
  startingHand;
  constructor(startingHand: number) {
    this.startingHand = startingHand;
  }
  cards: Card[] = [
    { value: '1', color: 'yellow', isSpecial: false, imgName: 'yellow_1' },
    { value: '1', color: 'yellow', isSpecial: false, imgName: 'yellow_1' },
    { value: '2', color: 'yellow', isSpecial: false, imgName: 'yellow_2' },
    { value: '2', color: 'yellow', isSpecial: false, imgName: 'yellow_2' },
    { value: '3', color: 'yellow', isSpecial: false, imgName: 'yellow_3' },
    { value: '3', color: 'yellow', isSpecial: false, imgName: 'yellow_3' },
    { value: '4', color: 'yellow', isSpecial: false, imgName: 'yellow_4' },
    { value: '4', color: 'yellow', isSpecial: false, imgName: 'yellow_4' },
    { value: '5', color: 'yellow', isSpecial: false, imgName: 'yellow_5' },
    { value: '5', color: 'yellow', isSpecial: false, imgName: 'yellow_5' },
    { value: '6', color: 'yellow', isSpecial: false, imgName: 'yellow_6' },
    { value: '6', color: 'yellow', isSpecial: false, imgName: 'yellow_6' },
    { value: '7', color: 'yellow', isSpecial: false, imgName: 'yellow_7' },
    { value: '7', color: 'yellow', isSpecial: false, imgName: 'yellow_7' },
    { value: '8', color: 'yellow', isSpecial: false, imgName: 'yellow_8' },
    { value: '8', color: 'yellow', isSpecial: false, imgName: 'yellow_8' },
    { value: '9', color: 'yellow', isSpecial: false, imgName: 'yellow_9' },
    { value: '9', color: 'yellow', isSpecial: false, imgName: 'yellow_9' },

    { value: '1', color: 'green', isSpecial: false, imgName: 'green_1' },
    { value: '1', color: 'green', isSpecial: false, imgName: 'green_1' },
    { value: '2', color: 'green', isSpecial: false, imgName: 'green_2' },
    { value: '2', color: 'green', isSpecial: false, imgName: 'green_2' },
    { value: '3', color: 'green', isSpecial: false, imgName: 'green_3' },
    { value: '3', color: 'green', isSpecial: false, imgName: 'green_3' },
    { value: '4', color: 'green', isSpecial: false, imgName: 'green_4' },
    { value: '4', color: 'green', isSpecial: false, imgName: 'green_4' },
    { value: '5', color: 'green', isSpecial: false, imgName: 'green_5' },
    { value: '5', color: 'green', isSpecial: false, imgName: 'green_5' },
    { value: '6', color: 'green', isSpecial: false, imgName: 'green_6' },
    { value: '6', color: 'green', isSpecial: false, imgName: 'green_6' },
    { value: '7', color: 'green', isSpecial: false, imgName: 'green_7' },
    { value: '7', color: 'green', isSpecial: false, imgName: 'green_7' },
    { value: '8', color: 'green', isSpecial: false, imgName: 'green_8' },
    { value: '8', color: 'green', isSpecial: false, imgName: 'green_8' },
    { value: '9', color: 'green', isSpecial: false, imgName: 'green_9' },
    { value: '9', color: 'green', isSpecial: false, imgName: 'green_9' },

    { value: '1', color: 'blue', isSpecial: false, imgName: 'blue_1' },
    { value: '1', color: 'blue', isSpecial: false, imgName: 'blue_1' },
    { value: '2', color: 'blue', isSpecial: false, imgName: 'blue_2' },
    { value: '2', color: 'blue', isSpecial: false, imgName: 'blue_2' },
    { value: '3', color: 'blue', isSpecial: false, imgName: 'blue_3' },
    { value: '3', color: 'blue', isSpecial: false, imgName: 'blue_3' },
    { value: '4', color: 'blue', isSpecial: false, imgName: 'blue_4' },
    { value: '4', color: 'blue', isSpecial: false, imgName: 'blue_4' },
    { value: '5', color: 'blue', isSpecial: false, imgName: 'blue_5' },
    { value: '5', color: 'blue', isSpecial: false, imgName: 'blue_5' },
    { value: '6', color: 'blue', isSpecial: false, imgName: 'blue_6' },
    { value: '6', color: 'blue', isSpecial: false, imgName: 'blue_6' },
    { value: '7', color: 'blue', isSpecial: false, imgName: 'blue_7' },
    { value: '7', color: 'blue', isSpecial: false, imgName: 'blue_7' },
    { value: '8', color: 'blue', isSpecial: false, imgName: 'blue_8' },
    { value: '8', color: 'blue', isSpecial: false, imgName: 'blue_8' },
    { value: '9', color: 'blue', isSpecial: false, imgName: 'blue_9' },
    { value: '9', color: 'blue', isSpecial: false, imgName: 'blue_9' },

    { value: '1', color: 'red', isSpecial: false, imgName: 'red_1' },
    { value: '1', color: 'red', isSpecial: false, imgName: 'red_1' },
    { value: '2', color: 'red', isSpecial: false, imgName: 'red_2' },
    { value: '2', color: 'red', isSpecial: false, imgName: 'red_2' },
    { value: '3', color: 'red', isSpecial: false, imgName: 'red_3' },
    { value: '3', color: 'red', isSpecial: false, imgName: 'red_3' },
    { value: '4', color: 'red', isSpecial: false, imgName: 'red_4' },
    { value: '4', color: 'red', isSpecial: false, imgName: 'red_4' },
    { value: '5', color: 'red', isSpecial: false, imgName: 'red_5' },
    { value: '5', color: 'red', isSpecial: false, imgName: 'red_5' },
    { value: '6', color: 'red', isSpecial: false, imgName: 'red_6' },
    { value: '6', color: 'red', isSpecial: false, imgName: 'red_6' },
    { value: '7', color: 'red', isSpecial: false, imgName: 'red_7' },
    { value: '7', color: 'red', isSpecial: false, imgName: 'red_7' },
    { value: '8', color: 'red', isSpecial: false, imgName: 'red_8' },
    { value: '8', color: 'red', isSpecial: false, imgName: 'red_8' },
    { value: '9', color: 'red', isSpecial: false, imgName: 'red_9' },
    { value: '9', color: 'red', isSpecial: false, imgName: 'red_9' },

    { value: '+2', color: 'yellow', isSpecial: true, imgName: 'yellow_+2' },
    { value: '+2', color: 'yellow', isSpecial: true, imgName: 'yellow_+2' },
    { value: 'stop', color: 'yellow', isSpecial: true, imgName: 'yellow_stop' },
    { value: 'stop', color: 'yellow', isSpecial: true, imgName: 'yellow_stop' },
    { value: 'rev', color: 'yellow', isSpecial: true, imgName: 'yellow_rev' },
    { value: 'rev', color: 'yellow', isSpecial: true, imgName: 'yellow_rev' },

    { value: '+2', color: 'green', isSpecial: true, imgName: 'green_+2' },
    { value: '+2', color: 'green', isSpecial: true, imgName: 'green_+2' },
    { value: 'stop', color: 'green', isSpecial: true, imgName: 'green_stop' },
    { value: 'stop', color: 'green', isSpecial: true, imgName: 'green_stop' },
    { value: 'rev', color: 'green', isSpecial: true, imgName: 'green_rev' },
    { value: 'rev', color: 'green', isSpecial: true, imgName: 'green_rev' },

    { value: '+2', color: 'blue', isSpecial: true, imgName: 'blue_+2' },
    { value: '+2', color: 'blue', isSpecial: true, imgName: 'blue_+2' },
    { value: 'stop', color: 'blue', isSpecial: true, imgName: 'blue_stop' },
    { value: 'stop', color: 'blue', isSpecial: true, imgName: 'blue_stop' },
    { value: 'rev', color: 'blue', isSpecial: true, imgName: 'blue_rev' },
    { value: 'rev', color: 'blue', isSpecial: true, imgName: 'blue_rev' },

    { value: '+2', color: 'red', isSpecial: true, imgName: 'red_+2' },
    { value: '+2', color: 'red', isSpecial: true, imgName: 'red_+2' },
    { value: 'stop', color: 'red', isSpecial: true, imgName: 'red_stop' },
    { value: 'stop', color: 'red', isSpecial: true, imgName: 'red_stop' },
    { value: 'rev', color: 'red', isSpecial: true, imgName: 'red_rev' },
    { value: 'rev', color: 'red', isSpecial: true, imgName: 'red_rev' },

    { value: '+4', color: 'black', isSpecial: true, imgName: '+4' },
    { value: '+4', color: 'black', isSpecial: true, imgName: '+4' },
    { value: 'color', color: 'black', isSpecial: true, imgName: 'color' },
    { value: 'color', color: 'black', isSpecial: true, imgName: 'color' },
  ];

  generateHand() {
    let result: Card[] = [];
    for (let i = 0; i < this.startingHand; i++) {
      result = [
        ...result,
        ...this.cards.splice(Math.floor(Math.random() * this.cards.length), 1),
      ];
    }

    return result;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
