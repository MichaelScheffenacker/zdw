"use strict";

import {u} from "./untils.js"
import {objectTypes} from "./settings.js";
import {merchant} from "./merchant.js";
import {Seed} from "./seed.js";

window.onload = function () {
    zdw();
};

const zdw = function () {

    const world = document.getElementById('zdw-world');

    let linMap = map.split("");

    let board = {
        moves: 0,
        crops: 0,
        credits: 0,
        text: ""
    };

    const behavior = {};
    objectTypes.forEach(ot => behavior[ot.char] = ot.behavior);

    const seeds = [];
    linMap.forEach((char, pos) => {
        if (char === ".") seeds.push(Seed(pos, board));
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
            board = objects[pos].action(board);
        }

        document.getElementById("moves-value").innerText = board.moves;
        document.getElementById("crops-value").innerText = board.crops;
        document.getElementById("credits-value").innerText = board.credits;
        document.getElementById("dialog").innerText = board.text;
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
▓▓▓▓▓▓▓▓▓▓`;
