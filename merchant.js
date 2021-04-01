import {u} from "./utils.js"

export const merchant = {
    pos: u.pos(7, 2),
    buy: function (amount) {
        const unitPrice = 2;
        return unitPrice * amount;  // payout
    },
    coo: function () {
        return u.coo(this.pos);
    },
    action: function (board) {
        const payout = this.buy(board.crops);
        return {
            ...board,
            crops: 0,
            credits: board.credits + payout,
            text: "The mill is broken."
        }
    }
};
