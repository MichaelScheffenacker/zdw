"use strict";

import {u} from "./untils.js"
import {objectTypes, rawMap} from "./settings.js";
import {merchant} from "./merchant.js";
import {Seed} from "./seed.js";

window.onload = function () {
    zdw();
};

const zdw = function () {

    const world = document.getElementById('zdw-world');

    let stillMap = rawMap.split("");

    let board = {
        moves: 0,
        crops: 0,
        credits: 0,
        text: ""
    };

    const behavior = {};
    objectTypes.forEach(ot => behavior[ot.char] = ot.behavior);

    const seeds = [];
    stillMap.forEach((char, pos) => {
        if (char === ".") seeds.push(Seed(pos, board));
    });

    const objects = {};
    seeds.forEach(function (seed) {
        objects[seed.pos] = seed;
    });
    objects[merchant.pos] = merchant;


    const render = function () {
        const map = [...stillMap];
        seeds.forEach(function (seed) {
            seed.cycle();
            map[seed.pos] = seed.state;
        });
        map[dweller.pos] = dweller.char;
        world.innerText = map.join("");

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
        char: "@", // "🏃"
        move: function (x, y) {
            let targetPos = u.trans(this.pos, x, y);
            const beh = behavior[stillMap[targetPos]];  // todo: why is `stillMap` here?
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
