import {u} from "./untils.js";

export const Seed = function (pos, board) {
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
        harvest: function () {
            if (this.state === "X") {
                this.state = ".";
                this.age = 1;
                this.board.crops += 1;
            }
        },
        action: function () {
            this.harvest();
        },
        board: board
    };
}
