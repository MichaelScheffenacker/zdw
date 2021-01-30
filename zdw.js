"use strict";

window.onload = function () {
    zdw();
}

const zdw = function() {

    const w = document.getElementById('zdw-world');

    let moves = 0;

    const bb = {
        "▓": 0,
        " ": 1,
        ".": 1,
        "x": 1,
        "X": 1,
        "O": -1
    }

    const Seed = function (x, y) {
        const random = getRandomInt(4);
        return {
            pos: { x: x, y: y },
            state: ".",
            age: 1,
            stages:{
                ".": { age: 10+random, next: "x" },
                "x": { age: 20+random*3, next: "X" },
                "X": { age: 0, next: ""}
            },
            cycle: function () {
                const stage = this.stages[this.state];
                if (this.age === stage.age) {
                    this.state = stage.next;
                }
                this.age += 1;
            },
            coo: function() { return coo(this.pos.x, this.pos.y); },
            harvest: function () { this.state = "."; this.age = 1; }
        };
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

    const setf = function () {
        let a = bg.split("");
        seeds.forEach( function(seed) {
            seed.cycle();
            a[seed.coo()] = seed.state;
            a[dweller.coo()] = dweller.character;
        });
        a = a.join("");
        w.innerText = a;
    };

    const dweller = {
        pos: { x: 3, y: 2 },
        character: "@", // "🏃"
        move: function (relX, relY) {
            const x = this.pos.x + relX;
            const y = this.pos.y + relY;
            const dest = bg[coo(x, y)];
            this.pos.x += bb[dest] * relX;
            this.pos.y += bb[dest] * relY;
            moves += 1;
        },
        coo: function() { return coo(this.pos.x, this.pos.y); },
        sow: function() {  }
    };

    const coo = function(x, y) {
        const width = 10 + 1;
        return y*width + x;
    }

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

const bg =
`▓▓▓▓▓▓▓▓▓▓
▓    ▓   ▓
▓    O   ▓
▓        ▓
▓    ▓   ▓
▓▓▓▓▓▓▓▓▓▓`

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
