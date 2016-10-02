import domReady from 'domready';
import 'browsernizr/test/touchevents';
import Modernizr from 'browsernizr';
import createStore from './utilities/createStore';
import calculatorReducer from './utilities/calculatorReducer';
import prettifyDisplay from './utilities/prettifyDisplay';
import BrowserInteractions from './utilities/browserInteractions';

domReady(function () {
    let touchEvent = Modernizr.touchevents;
    touchEvent || new BrowserInteractions('h', 's');

    /**
    * Adding active classes to nav for color.
    */
    const navButtons = document.querySelectorAll('.nav__links a[href*="#"]');
    [].forEach.call(navButtons, function (el) {
        el.addEventListener('click', function () {
            if (document.querySelector('.nav__links .nav-active')) {
                document.querySelector('.nav__links .nav-active').classList.remove('nav-active');
                el.classList.add('nav-active');
            } else {
                el.classList.add('nav-active');
            }
        });
    });

    /**
    * Adding drawer open class to alter transition speed.
    */
    const mobileNavToggle = document.querySelectorAll('label[for=backdrop]');

    [].forEach.call(mobileNavToggle, function (el) {
        el.addEventListener('click', function () {
            document.querySelector('body').classList.toggle('drawer-is-opened');
        });
    });

    const store = createStore(calculatorReducer);
    const dispatch = store.dispatch;

    /**
    * Attaching event listeners to all calculator buttons.
    *
    */
    /**
     * Attaching event listeners to all calculator buttons.
     *
     */
    [].forEach.call(document.querySelectorAll('.-calculator button'), function (el) {
        el.addEventListener('click', function () {
            const type = el.getAttribute('data-type');
            const value = el.getAttribute('data-value');
            if (type === 'NUMBER') {
                dispatch({
                    type,
                    number: value,
                });
            } else if (value === '+') {
                dispatch({
                    type: 'ADD',
                });
            } else if (value === '-') {
                dispatch({
                    type: 'MINUS',
                });
            } else if (value === '*') {
                dispatch({
                    type: 'MULTI',
                });
            } else if (value === '/') {
                dispatch({
                    type: 'DIVIDE',
                });
            } else if (type === 'DOT' || type === 'EQUAL' || type === 'CLEAR' || type === 'BACK') {
                dispatch({
                    type,
                });
            }
        });
    });

    /**
    * A function that is invoked whenever the state changes.
    * So when the state changes, the display output in the browser also changes.
    *
    */
    function render() {
        const lastResult = document.querySelector('.calculator__results--last');
        const currentResult = document.querySelector('.calculator__results--current');

        lastResult.innerHTML = prettifyDisplay(store.getState().last, true);
        currentResult.innerHTML = prettifyDisplay(store.getState().current, false);
    }

    /**
    * Subsribing to changes from the state.
    * If that state changes, the provided function (render) will be invoked.
    *
    */
    store.subscribe(render);
});
