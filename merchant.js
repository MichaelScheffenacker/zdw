import {u} from "./untils.js"

export const merchant = {
    pos: u.pos(7, 2),
    buy: function (amount) {
        const unitPrice = 2;
        return unitPrice * amount;  // payout
    },
    coo: function () {
        return u.coo(this.pos);
    },
    action: function () {
        const payout = this.buy(this.board.crops);
        this.board.crops = 0;
        this.board.credits += payout;
        const text = "The mill is broken.";
        document.getElementById("dialog").innerText = text;
    },
    board: {}
};
