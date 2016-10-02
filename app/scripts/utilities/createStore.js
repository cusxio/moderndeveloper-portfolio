/**
 * A state management function.
 * This functions also holds the state of the application in the state variable.
 * The state of the application is then available via closure whenever the state.getState function is called.
 *
 * @param  {Function} reducer The function to be invoked when actions are dispatched.
 * @return {Object}
 */

export default function createStore(reducer) {
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
