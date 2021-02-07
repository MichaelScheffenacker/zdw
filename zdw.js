"use strict";

window.onload = function () {
    zdw();
}

const zdw = function () {

    const world = document.getElementById('zdw-world');

    let linMap = map.split("");

    let moves = 0;
    let crops = 5;
    let credits = 0;

    const behavior = {};
    objectTypes.forEach(ot => behavior[ot.char] = ot.behavior);

    const Seed = function (pos) {
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
                    crops += 1;  // todo: global variable
                }
            },
            action: function () {
                this.harvest();
            }
        };
    }

    const merchant = {
        pos: u.pos(7, 2),
        buy: function (amount) {
            const unitPrice = 2;
            return unitPrice * amount;  // payout
        },
        coo: function () {
            return u.coo(this.pos);
        },
        action: function () {
            const payout = this.buy(crops);
            crops = 0;          // todo: global variables
            credits += payout;
        }
    }

    const seeds = [];
    linMap.forEach((char, coo) => {
        if (char === ".") seeds.push(Seed(u.toPos(coo)));
    });

    const objects = {};
    seeds.forEach(function (seed) {
        objects[seed.coo()] = seed;
    });
    objects[merchant.coo()] = merchant;


    const render = function () {
        linMap[u.coo(dweller.background.pos)] = dweller.background.char;    // todo: refactor preservation of the background.
        dweller.background.pos = dweller.pos;                               // More comfortable: separating static from movable objects, and keep the background information that way.
        dweller.background.char = linMap[dweller.coo()];
        seeds.forEach(function (seed) {
            seed.cycle();
            linMap[seed.coo()] = seed.state;
        });
        linMap[dweller.coo()] = dweller.char;
        world.innerText = linMap.join("");

    };

    const environment = function (coo) {

        moves += 1;

        if (coo in objects) {
            objects[coo].action(dweller);
        }

        // todo: move updates to the methods?
        document.getElementById("moves-value").innerText = moves;
        document.getElementById("crops-value").innerText = crops;
        document.getElementById("credits-value").innerText = credits;
    }

    const dweller = {
        pos: u.pos(3, 2),
        background: {
            pos: u.pos(3, 2),
            char: " "
        },
        char: "@", // "🏃"
        move: function (relX, relY) {
            let targetCoo = u.coo(u.trans(this.pos, relX, relY));
            const beh = behavior[linMap[targetCoo]];
            this.pos = u.trans(this.pos, beh * relX, beh * relY);
            environment(targetCoo);
        },
        coo: function () {
            return u.coo(this.pos);
        },
        sow: function () {
        },

    };

    render();
    document.addEventListener('keypress', (event) => {
        const dir = {
            w: () => dweller.move(0, -1),
            d: () => dweller.move(1, 0),
            s: () => dweller.move(0, 1),
            a: () => dweller.move(-1, 0)
        }
        dir[event.key]();
        render();
    })

}

const map =
`▓▓▓▓▓▓▓▓▓▓
▓..  ▓   ▓
▓..  O # ▓
▓..      ▓
▓..  ▓   ▓
▓▓▓▓▓▓▓▓▓▓`

const u = {
    // a coordinate `coo` is her always interpreted as the index of our
    // linearized world. This means `coo` always a single integer that
    // points to position in the string of the world represents that
    // position. The position `pos` on the other hand represents that
    // position with a `x` and and a `y` coordinate.
    width: 10 + 1,
    coo: function (pos) {
        const {x, y} = pos;
        return y * this.width + x;
    },
    pos: function (x, y) {
        return {x: x, y: y};
    },
    trans: function (pos, x, y) {
        return u.pos(pos.x + x, pos.y + y);
    },
    rand: function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    toPos: function (coo) {
        const x = coo % this.width;
        const y = Math.floor(coo / this.width);
        return this.pos(x, y);
    }
};

const objectTypes = [
    {
        name: "dweller",
        char: "@",
        behavior: 0
    }, {
        name: "merchant",
        char: "#",
        behavior: 0
    }, {
        name: "seed",
        char: ".",
        behavior: 1
    }, {
        name: "sprout",
        char: "x",
        behavior: 1
    }, {
        name: "plant",
        char: "X",
        behavior: 0
    }, {
        name: "nothing",
        char: " ",
        behavior: 1
    }, {
        name: "wall",
        char: "▓",
        behavior: 0
    }, {
        name: "bouncer",
        char: "O",
        behavior: -1
    }

];
