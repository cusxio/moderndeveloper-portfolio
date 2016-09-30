(function (document) {
    function domReady(cb) {
        document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
    }

    /**
     * A state management function.
     * This functions also holds the state of the application in the state variable.
     * The state of the application is then available via closure whenever the state.getState function is called.
     *
     * @param  {Function} reducer The function to be invoked when actions are dispatched.
     * @return {Object}
     */
    function createStore(reducer) {
        let state;
        let listeners = [];

        function getState() {
            return state;
        }

        function dispatch(action) {
            state = reducer(state, action);
            listeners.forEach(function (listener) {
                return listener();
            });
        }

        function subscribe(listener) {
            listeners.push(listener);
            return function () {
                listeners = listeners.filter(function (l) {
                    return l !== listener;
                });
            };
        }

        dispatch({});

        return {
            getState,
            dispatch,
            subscribe,
        };
    }

    /**
     * A function to prettify float numbers in JavaScript.
     *
     * @param  {String} input Valid number input to be prettified.
     * @return {Number}       Prettified number output.
     */
    function fixFloat(input) {
        return parseFloat(Number(input).toPrecision(9));
    }

    function prettifyDisplay(input, spaces) {
        const symbols = [{
            reg: /\*/g,
            dest: '×',
        }, {
            reg: /\//g,
            dest: '÷',
        }, {
            reg: /\-/g,
            dest: '−',
        }, {
            reg: /\+/g,
            dest: '+',
        }];
        symbols.forEach((item) => {
            if (spaces) {
                input = input.replace(item.reg, ' ' + item.dest + ' ');
            } else {
                input = input.replace(item.reg, item.dest);
            }
        });
        return input;
    }

    domReady(function () {
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
         * Scroll event listener to add shadow to nav.
         */
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop > 0) {
                document.querySelector('.nav').classList.add('body-is-scrolled');
            } else {
                document.querySelector('.nav').classList.remove('body-is-scrolled');
            }
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

        const initialState = {
            last: '',
            current: '0',
        };

        /**
         * The reducer function to handle actions and states.
         * When an action is dispatched via the dispatch function, the reducer will be invoked.
         * The reducer function will then update the state based on the actions.
         * Once the state is updated based on the dispatched action, a new state object is returned by the reducer function.
         * @param  {Object} state
         * @param  {Object} action The dispatched action from store.dispatch.
         * @return {Object}        The state of the application
         */
        function reducer(state = initialState, action) {
            let current;
            let last;
            switch (action.type) {
                case 'CLEAR':
                    return Object.assign({}, initialState);
                case 'BACK':
                    return Object.assign({}, state, {
                        current: state.current === '0' ? state.current : state.current.slice(0, -1) || '0',
                    });
                case 'ADD':
                    current = state.current;
                    last = current.slice(-1);
                    if (last === '+' || last === '-' || last === '*' || last === '/') {
                        return Object.assign({}, state, {
                            current: current.slice(0, -1) + '+',
                        });
                    }
                    return Object.assign({}, state, {
                        current: current + '+',
                    });
                case 'MINUS':
                    current = state.current;
                    last = current.slice(-1);
                    if (last === '+' || last === '-' || last === '*' || last === '/') {
                        return Object.assign({}, state, {
                            current: current.slice(0, -1) + '-',
                        });
                    }
                    return Object.assign({}, state, {
                        current: current + '-',
                    });
                case 'MULTI':
                    current = state.current;
                    last = current.slice(-1);
                    if (last === '+' || last === '-' || last === '*' || last === '/') {
                        return Object.assign({}, state, {
                            current: current.slice(0, -1) + '*',
                        });
                    }
                    return Object.assign({}, state, {
                        current: current + '*',
                    });
                case 'DIVIDE':
                    current = state.current;
                    last = current.slice(-1);
                    if (last === '+' || last === '-' || last === '*' || last === '/') {
                        return Object.assign({}, state, {
                            current: current.slice(0, -1) + '/',
                        });
                    }
                    return Object.assign({}, state, {
                        current: current + '/',
                    });
                case 'EQUAL':
                    try {
                        return Object.assign({}, state, {
                            last: state.current,
                            current: fixFloat(eval(state.current)) + '' //eslint-disable-line
                        });
                    } catch (e) {
                        return Object.assign({}, state, {
                            last: state.current,
                            current: 'Error :(',
                        });
                    }
                case 'NUMBER':
                    return Object.assign({}, state, {
                        current: state.current === '0' ? action.number : state.current + action.number,
                    });
                case 'DOT':
                    current = state.current;
                    var lastLetter = current.slice(-1);
                    if (lastLetter !== '.') {
                        return Object.assign({}, state, {
                            current: state.current + '.',
                        });
                    }
                default: //eslint-disable-line
                    return state;
            }
        }

        const store = createStore(reducer);
        const dispatch = store.dispatch;

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
})(document);
