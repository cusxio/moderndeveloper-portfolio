/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */

import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

export default class BrowserInteractions {
    constructor(hoverClass, scrollClass) {
        this.hoverClass = hoverClass;
        this.scrollClass = scrollClass;
        this._onScroll = this._onScroll.bind(this);
        this._scrollActionsInit();
    }
    _scrollActionsInit() {
        document.body.classList.add(this.hoverClass);
        window.addEventListener('scroll', this._onScroll);
    }
    _onScroll() {
        document.body.classList.contains(this.hoverClass) && document.body.classList.remove(this.hoverClass);
        this._hoverThrottle();
        this._scrollThrottle();
    }
    _hoverThrottle() {
        debounce(function cb() {
            document.body.classList.add(this.hoverClass);
        }, 100).bind(this)();
    }
    _scrollThrottle() {
        throttle(function cb() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            scrollTop > 0.15 * window.innerHeight ? document.body.classList.add(this.scrollClass) : document.body.classList.remove(this.scrollClass);
        }).bind(this)();
    }
}
