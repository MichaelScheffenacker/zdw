"use strict";

window.onload = function () {
    zdw();
}

const zdw = function() {

    const world = document.getElementById('zdw-world');

    let moves = 0;

    const behavior = {
        "▓": 0,
        " ": 1,
        ".": 1,
        "x": 1,
        "X": 1,
        "O": -1
    }

    const Seed = function (x, y) {
        const sproutTime = 10 + getRandomInt(10);
        const growTime = 20 + getRandomInt(30);
        return {
            pos: { x: x, y: y },
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
        let linMap = map.split("");
        seeds.forEach( function(seed) {
            seed.cycle();
            linMap[seed.coo()] = seed.state;
            linMap[dweller.coo()] = dweller.character;
        });
        linMap = linMap.join("");
        world.innerText = linMap;
    };

    const dweller = {
        pos: { x: 3, y: 2 },
        character: "@", // "🏃"
        move: function (relX, relY) {
            const x = this.pos.x + relX;
            const y = this.pos.y + relY;
            const dest = map[coo(x, y)];
            this.pos.x += behavior[dest] * relX;
            this.pos.y += behavior[dest] * relY;
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

const map =
`▓▓▓▓▓▓▓▓▓▓
▓    ▓   ▓
▓    O   ▓
▓        ▓
▓    ▓   ▓
▓▓▓▓▓▓▓▓▓▓`

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
