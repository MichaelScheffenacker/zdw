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

    let board = {
        moves: 0,
        crops: 0,
        credits: 0,
        text: ""
    };

    const behavior = {};
    set.objectTypes.forEach(ot => behavior[ot.char] = ot.behavior);

    const seeds = [];
    const constructors = {};
    set.objectTypes.forEach(type => {
        constructors[type.char] = () => Object.create({ char: type.char, action: board => board });
        if (type.name === "seed") {
            constructors[type.char] = () => {
                const seed = Seed(u.pos(2, 2), board);
                seeds.push(seed);
                return seed;
            };
        }
        if (type.name === "merchant") {
            constructors[type.char] = () => merchant;
        }
    });

    const stillMap = Array.from(
        set.rawMap.split(""),
        char => constructors[char]()
        );

    const objects = {};
    seeds.forEach(function (seed) {
        objects[seed.pos] = seed;
    });

    const render = function (key) {
        const map = Array.from(stillMap);
        seeds.forEach( seed => seed.cycle() );

        const delta = set.dir[key];
        const targetPos = u.trans(dweller.pos, delta.x, delta.y);
        const target = map[targetPos]
        const beh = behavior[target.char];
        dweller.move(delta.x, delta.y, beh)
        board = target.action(board);

        map[dweller.pos] = dweller;
        world.innerText = Array.from(map, object => object.char).join("");

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
