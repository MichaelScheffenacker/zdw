export const u = {
    // coo is a 2D coordinate
    // pos is a linearized coordinate, a single integer

    width: 10 + 1,
    coo: function (pos) {
        const x = pos % this.width;
        const y = Math.floor(pos / this.width);
        return {x: x, y: y};
    },
    pos: function (x, y) {
        return this.toPos( {x, y})
    },
    toPos: function (coo) {
        const {x, y} = coo;
        return y * this.width + x;
    },
    trans: function (pos, x, y) {
        const coo = this.coo(pos);
        return u.pos(coo.x + x, coo.y + y);
    },
    rand: function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
};
