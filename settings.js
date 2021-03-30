export const objectTypes = [
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
];

export const rawMap =
`▓▓▓▓▓▓▓▓▓▓
▓..      ▓
▓..  O # ▓
▓..      ▓
▓..      ▓
▓▓▓▓▓▓▓▓▓▓`;
