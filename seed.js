import {u} from "./untils.js";

export const Seed = function (pos) {
    const sproutTime = 10 + u.rand(10);
    const growTime = 20 + u.rand(30);
    return {
        pos: pos,
        state: ".",
        age: 1,
        stages: {
            ".": {age: sproutTime, next: "x"},
            "x": {age: growTime, next: "X"},
            "X": {age: 0, next: ""}
        },
        cycle: function () {
            const stage = this.stages[this.state];
            if (this.age === stage.age) {
                this.state = stage.next;
            }
            this.age += 1;
        },
        coo: function () {
            return u.coo(this.pos);
        },
        harvest: function (board) {
            let crops = board.crops;
            if (this.state === "X") {
                this.state = ".";
                this.age = 1;
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
