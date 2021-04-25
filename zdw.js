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

    const seeds = [];
    const constructors = {};
    set.objectTypes.forEach(type => {
        constructors[type.char] = () => Object.create({
            char: type.char,
            action: board => board,
            behavior: type.behavior
        });
        if (type.name === "seed") {
            constructors[type.char] = (pos) => {
                const seed = Seed(pos);
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
        (char, pos) => constructors[char](pos)
        );

    const render = function (key) {
        const map = Array.from(stillMap);
        seeds.forEach( seed => seed.cycle() );

        const delta = set.dir[key];
        const target = dweller.move(delta, map);
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
        move: function (delta, map) {
            const {x, y} = delta
            const targetPos = u.trans(dweller.pos, x, y);
            const target = map[targetPos];
            const beh = target.behavior;
            this.pos = u.trans(this.pos, beh * x, beh * y);
            return target
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
