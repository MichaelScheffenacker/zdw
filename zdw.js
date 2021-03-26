"use strict";

import {u} from "./untils.js"
import {merchant} from "./merchant.js";
import {objectTypes} from "./settings.js";

window.onload = function () {
    zdw();
};

const zdw = function () {

    const world = document.getElementById('zdw-world');

    let linMap = map.split("");

    const board = {
        moves: 0,
        crops: 0,
        credits: 0
    }

    merchant.board = board

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
                    this.board.crops += 1;
                }
            },
            action: function () {
                this.harvest();
            },
            board: board
        };
    }

    const seeds = [];
    linMap.forEach((char, pos) => {
        if (char === ".") seeds.push(Seed(pos));
    });

    const objects = {};
    seeds.forEach(function (seed) {
        objects[seed.pos] = seed;
    });
    objects[merchant.pos] = merchant;


    const render = function () {
        linMap[dweller.background.pos] = dweller.background.char;    // todo: refactor preservation of the background.
        dweller.background.pos = dweller.pos;                        // More comfortable: separating static from movable objects, and keep the background information that way.
        dweller.background.char = linMap[dweller.pos];
        seeds.forEach(function (seed) {
            seed.cycle();
            linMap[seed.pos] = seed.state;
        });
        linMap[dweller.pos] = dweller.char;
        world.innerText = linMap.join("");

    };

    const environment = function (pos) {

        board.moves += 1;

        if (pos in objects) {
            objects[pos].action(dweller);
        }

        // todo: move updates to the methods?
        document.getElementById("moves-value").innerText = board.moves;
        document.getElementById("crops-value").innerText = board.crops;
        document.getElementById("credits-value").innerText = board.credits;
    };

    const dweller = {
        pos: u.pos(3, 2),
        background: {
            pos: u.pos(3, 2),
            char: " "
        },
        char: "@", // "🏃"
        move: function (x, y) {
            let targetPos = u.trans(this.pos, x, y);
            const beh = behavior[linMap[targetPos]];
            this.pos = u.trans(this.pos, beh * x, beh * y);
            environment(targetPos);
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
        };
        dir[event.key]();
        render();
    })

};

const map =
`▓▓▓▓▓▓▓▓▓▓
▓..      ▓
▓..  O # ▓
▓..      ▓
▓..      ▓
▓▓▓▓▓▓▓▓▓▓`
