// Loaded exactly once by the single Node.js process (Node's require cache).
// Every renderer window that calls window.require('./shared-state.cjs')
// reaches this same module instance, so `seq` proves all windows share one
// Node.js runtime.
let seq = 0;

module.exports = {
    next: function () {
        seq += 1;
        return seq;
    },
    total: function () {
        return seq;
    },
};
