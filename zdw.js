"use strict";

window.onload = function () {
    zdw();
}

const zdw = function() {

    const world = document.getElementById('zdw-world');

    let moves = 0;
    let crops = 5;
    let credits = 0;

    const behavior = {
        "▓": 0,
        " ": 1,
        ".": 1,
        "x": 1,
        "X": 0,
        "O": -1,
        "n": 0,
        "#": 0,
        "@": 0,
    }

    const Seed = function (x, y) {
        const sproutTime = 10 + u.rand(10);
        const growTime = 20 + u.rand(30);
        return {
            pos: u.pos(x, y),
            state: ".",
            age: 1,
            stages:{
                ".": { age: sproutTime, next: "x" },
                "x": { age: growTime, next: "X" },
                "X": { age: 0, next: ""}
            },
            cycle: function () {
                const stage = this.stages[this.state];
                if (this.age === stage.age) {
                    this.state = stage.next;
                }
                this.age += 1;
            },
            coo: function() { return u.coo(this.pos); },
            harvest: function () {
                if (this.state === "X") {
                    this.state = ".";
                    this.age = 1;
                    crops += 1;  // todo: global variable
                }
            }
        };
    }

    const merchant = {
        pos: u.pos(7, 2),
        buy: function(amount) {
            const unitPrice = 2;
            const payout = unitPrice * amount;
            return payout;
        },
        coo: function() { return u.coo(this.pos); }
    }

    const seeds = [
        Seed(1, 1),
        Seed(2, 1),
        Seed(1, 2),
        Seed(2, 2),
        Seed(1, 3),
        Seed(2, 3),
        Seed(1, 4),
        Seed(2, 4)
    ];

    const Seeds = {};
    seeds.forEach(function (seed) { Seeds[seed.coo()] = seed });

    const setf = function () {
        let linMap = map.split("");
        seeds.forEach( function(seed) {
            seed.cycle();
            linMap[seed.coo()] = seed.state;
            linMap[dweller.coo()] = dweller.character;
        });
        linMap[merchant.coo()] = "#"
        linMap = linMap.join("");
        world.innerText = linMap;
    };

    const environment = function (coo) {

        moves += 1;

        if (coo in Seeds) {
            const seed = Seeds[coo];
            seed.harvest();
        }

        if (coo === merchant.coo()) {
            dweller.sell(merchant);
        }

        // todo: move updates to the methods?
        document.getElementById("moves-value").innerText = moves;
        document.getElementById("crops-value").innerText = crops;
        document.getElementById("credits-value").innerText = credits;
    }

    const dweller = {
        pos: u.pos(3, 2),
        character: "@", // "🏃"
        move: function (relX, relY) {
            let targetCoo = u.coo(u.trans(this.pos,relX, relY));
            const beh = targetCoo in Seeds ? behavior[Seeds[targetCoo].state] : behavior[map[targetCoo]] ;  // We need to find a generalized solution for that ...
            this.pos = u.trans(this.pos, beh*relX, beh*relY );
            environment(targetCoo);
        },
        coo: function() { return u.coo(this.pos); },
        sow: function() {  },
        sell: function(merchant) {
            const payout = merchant.buy(crops);
            crops = 0;          // todo: global variables
            credits += payout;
        }
    };



    setf();
    document.addEventListener('keypress', (event) => {
        const dir = {
            w: () => dweller.move(0, -1),
            d: () => dweller.move(1, 0),
            s: () => dweller.move(0, 1),
            a: () => dweller.move(-1, 0)
        }
        dir[event.key]();
        setf();
    })

}

const map =
`▓▓▓▓▓▓▓▓▓▓
▓    ▓   ▓
▓    O   ▓
▓        ▓
▓    ▓   ▓
▓▓▓▓▓▓▓▓▓▓`

const u = {
    coo: function(pos) {
        const { x, y } = pos;
        const width = 10 + 1;
        return y*width + x;
    },
    pos: function(x, y) {
        return { x: x, y: y };
    },
    trans: function(pos, x, y) {
        return u.pos(pos.x + x, pos.y + y);
    },
    rand: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
