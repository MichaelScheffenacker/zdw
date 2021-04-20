const rawMap =
`▓▓▓▓▓▓▓▓▓▓
▓..      ▓
▓..  O # ▓
▓..      ▓
▓..      ▓
▓▓▓▓▓▓▓▓▓▓`;

export const set ={
    objectTypes: [
        {
            name: "dweller",
            char: "@",
            behavior: 0
        }, {
            name: "merchant",
            char: "#",
            behavior: 0
        }, {
            name: "seed",
            char: ".",
            behavior: 1
        }, {
            name: "sprout",
            char: "x",
            behavior: 1
        }, {
            name: "plant",
            char: "X",
            behavior: 0
        }, {
            name: "nothing",
            char: " ",
            behavior: 1
        }, {
            name: "wall",
            char: "▓",
            behavior: 0
        }, {
            name: "bouncer",
            char: "O",
            behavior: -1
        }
    ],
    dir: {
        w: { x:0, y: -1 },
        d: { x:1, y: 0 },
        s: { x:0, y: 1 },
        a: { x:-1, y: 0 },
        null: {x: 0, y:0 }
    },
    rawMap: rawMap
}
