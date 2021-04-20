"use strict";

import {u} from "./utils.js"
import {set} from "./settings.js";
import {merchant} from "./merchant.js";
import {Seed} from "./seed.js";

window.onload = function () {
    zdw();
};

const zdw = function () {

    const world = document.getElementById('zdw-world');

    let stillMap = set.rawMap.split("");

    let board = {
        moves: 0,
        crops: 0,
        credits: 0,
        text: ""
    };

    const behavior = {};
    set.objectTypes.forEach(ot => behavior[ot.char] = ot.behavior);

    const seeds = [];
    stillMap.forEach((char, pos) => {
        if (char === ".") seeds.push(Seed(pos, board));
    });

    const objects = {};
    seeds.forEach(function (seed) {
        objects[seed.pos] = seed;
    });
    objects[merchant.pos] = merchant;


    const render = function (key) {
        const map = [...stillMap];
        seeds.forEach(function (seed) {
            seed.cycle();
            map[seed.pos] = seed.state;
        });

        const delta = set.dir[key];
        const targetPos = u.trans(dweller.pos, delta.x, delta.y);
        const beh = behavior[map[targetPos]];
        dweller.move(delta.x, delta.y, beh);

        if (targetPos in objects) {
            board = objects[targetPos].action(board);
        }

        seeds.forEach((seed) => map[seed.pos] = seed.state)
        map[dweller.pos] = dweller.char;
        world.innerText = map.join("");

        environment();
    };

    const environment = function () {

        board.moves += 1;

        document.getElementById("moves-value").innerText = board.moves;
        document.getElementById("crops-value").innerText = board.crops;
        document.getElementById("credits-value").innerText = board.credits;
        document.getElementById("dialog").innerText = board.text;
    };

    const dweller = {
        pos: u.pos(3, 2),
        char: "@", // "🏃"
        move: function (x, y, beh) {
            this.pos = u.trans(this.pos, beh * x, beh * y);

        },
        coo: function () {
            return u.coo(this.pos);
        },
        sow: function () {
        },

    };

    render(null);
    document.addEventListener('keypress', (event) => {
        render(event.key);
    })

};
