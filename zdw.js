"use strict";

window.onload = function () {
    zdw();
}

const zdw = function() {

    const world = document.getElementById('zdw-world');

    let moves = 0;
    let crops = 0;

    const behavior = {
        "▓": 0,
        " ": 1,
        ".": 1,
        "x": 1,
        "X": 0,
        "O": -1,
        "n": 0,
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
            coo: function() { return coo(this.pos); },
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

    const Seeds = {};
    seeds.forEach(function (seed) { Seeds[seed.coo()] = seed });

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
            const {x, y} = this.pos
            const pos = { x: x + relX, y: y + relY };
            let coord = coo(pos);
            console.log(coord in Seeds ? Seeds[coord].state : 0)
            const beh = coord in Seeds ? behavior[Seeds[coord].state] : behavior[map[coord]] ;  // We need to find a generalized solution for that ...
            this.pos = { x: x + beh*relX, y: y + beh*relY };
            moves += 1;

            console.log(seeds);

            if (coord in Seeds) {
                const seed = Seeds[coord];
                if (seed.state === "X") {
                    seed.harvest();
                    crops += 1;
                }
            }

            document.getElementById("moves-value").innerText = moves;
            document.getElementById("crops-value").innerText = crops;

        },
        coo: function() { return coo(this.pos); },
        sow: function() {  }
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const coo = function(pos) {
    const { x, y } = pos;
    const width = 10 + 1;
    return y*width + x;
}
