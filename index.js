import { bindAll, requestAnimationFrame } from '../../../js/util/function';

const CLASS_SCROLLER_WRAPPER = '.scroller-wrapper';
const CLASS_SCROLLER = '.scroller';
const CLASS_SCROLLER_BAR = '.scroller-bar';

const ERR_NO_BAR = 'Can not read bar node';
const ERR_NO_WRAPPER = 'Can not read wrapper node';

const root = document.documentElement;

function Scroller() {
    this.h1 = 0; // wrapper height
    this.h2 = 0; // scroller height
    this.h3 = 0; // bar height

    this.m1 = 0; // mouse start y
    this.m2 = 0; // current mouse y

    this.t1 = 0; // scroller top
    this.t2 = 0; // bar top

    this.n1 = null; // wrapper node
    this.n2 = null; // scroller node
    this.n3 = null; // bar node

    this.dragging = false;
    this.callback = null;

    bindAll(this,
        'onScrollWrapper',
        'onMouseDownBar',
        'onMouseUp',
        'onMouseMove'
    );
}

const wrapperEvents = {
    installWrapperListener() {
        if (!this.n1) {
            throw ERR_NO_WRAPPER;
        }

        this.n1.addEventListener('mousewheel', this.onScrollWrapper);
        this.n1.addEventListener('DOMMouseScroll', this.onScrollWrapper);
    },

    uninstallWrapperListener() {
        this.n1.removeEventListener('mousewheel', this.onScrollWrapper);
        this.n1.removeEventListener('DOMMouseScroll', this.onScrollWrapper);
    },

    onScrollWrapper(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        return false;
    }
};

const barEvents = {
    installBarListener() {
        if (!this.n3) {
            throw ERR_NO_BAR;
        }

        this.n3.addEventListener('mousedown', this.onMouseDownBar);
        root.addEventListener('mouseup', this.onMouseUp);
        root.addEventListener('mousemove', this.onMouseMove);
    },

    uninstallBarListener() {
        this.n3.removeEventListener('mousedown', this.onMouseDownBar);
        root.removeEventListener('mouseup', this.onMouseUp);
        root.removeEventListener('mousemove', this.onMouseMove);
    },

    onMouseDownBar(ev) {
        this.dragging = true;
    },

    onMouseUp(ev) {
        this.dragging = false;
    },

    onMouseMove(ev) {
        if (!this.dragging) {
            return;
        }

        console.log(ev)
    }
};

const life = {
    notify() {
        callback && callback(
        {
            top: this.t1
        },
        {
            top: this.t2,
            height: this.h3
    }
        );
    },

    destroy() {
        this.uninstallBarListener();
        this.uninstallWrapperListener();

        this.h1 = this.h2 = this.m1 = this.m2 = 0;
        this.n1 = this.n2 = this.n3 = null;
    }
};

const utils = {
    setNode(node) {
        this.n1 = node.querySelector(CLASS_SCROLLER);
        this.n2 = node.querySelector(CLASS_SCROLLER_WRAPPER);
        this.n3 = node.querySelector(CLASS_SCROLLER_BAR);

        this.h1 = this.n1.clientHeight;
        this.h2 = this.n2.clientHeight;

        this.installBarListener();
        this.installWrapperListener();
    },

    setCallback(callback, context = null) {
        this.callback = callback.bind(context);
    }
};

Object.assign(
    Scroller.prototype,
    utils,
    barEvents,
    wrapperEvents
);

export default Scroller;
