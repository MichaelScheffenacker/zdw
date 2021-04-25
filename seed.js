import {u} from "./utils.js";

export const Seed = function (pos) {
    const sproutTime = 10 + u.rand(10);
    const growTime = 20 + u.rand(30);
    return {
        pos: pos,
        char: ".",
        behavior: 1,
        age: 1,
        stages: {
            ".": {age: sproutTime, next: "x", beh: 1},
            "x": {age: growTime, next: "X", beh: 0},
            "X": {age: 0, next: "", beh: 1}
        },
        cycle: function () {
            const stage = this.stages[this.char];
            if (this.age === stage.age) {
                this.char = stage.next;
                this.behavior = stage.beh;
            }
            this.age += 1;
        },
        coo: function () {
            return u.coo(this.pos);
        },
        harvest: function (board) {
            let crops = board.crops;
            if (this.char === "X") {
                this.char = ".";
                this.age = 1;
                this.behavior = 1;
                crops += 1;
            }
            return {
                ...board,
                crops: crops
            }
        },
        action: function (board) {
            return this.harvest(board);
        }
    };
};
