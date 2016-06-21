export function bindAll(context) {
    for (let i = 1; i < arguments.length; i += 1) {
        const name = arguments[i];
        const method = context[name];

        context[name] = method.bind(context);
    }
};

export const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        return setTimeout(callback, 1000 / 60);
    };
