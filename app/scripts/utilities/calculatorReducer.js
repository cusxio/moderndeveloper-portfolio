import fixFloat from './fixFloat';
/**
 * The reducer function to handle actions and states.
 * When an action is dispatched via the dispatch function, the reducer will be invoked.
 * The reducer function will then update the state based on the actions.
 * Once the state is updated based on the dispatched action, a new state object is returned by the reducer function.
 * @param  {Object} state
 * @param  {Object} action The dispatched action from store.dispatch.
 * @return {Object}        The state of the application
 */

const initialState = {
    last: '',
    current: '0',
};

const eval2 = eval; //eslint-disable-line

export default function reducer(state = initialState, action) {
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
                    current: `${current.slice(0, -1)}+`,
                });
            }
            return Object.assign({}, state, {
                current: `${current}+`,
            });
        case 'MINUS':
            current = state.current;
            last = current.slice(-1);
            if (last === '+' || last === '-' || last === '*' || last === '/') {
                return Object.assign({}, state, {
                    current: `${current.slice(0, -1)}-`,
                });
            }
            return Object.assign({}, state, {
                current: `${current}-`,
            });
        case 'MULTI':
            current = state.current;
            last = current.slice(-1);
            if (last === '+' || last === '-' || last === '*' || last === '/') {
                return Object.assign({}, state, {
                    current: `${current.slice(0, -1)}*`,
                });
            }
            return Object.assign({}, state, {
                current: `${current}*`,
            });
        case 'DIVIDE':
            current = state.current;
            last = current.slice(-1);
            if (last === '+' || last === '-' || last === '*' || last === '/') {
                return Object.assign({}, state, {
                    current: `${current.slice(0, -1)}/`,
                });
            }
            return Object.assign({}, state, {
                current: `${current}/`,
            });
        case 'EQUAL':
            try {
                return Object.assign({}, state, {
                    last: state.current,
                    current: fixFloat(eval2(state.current)) + '' //eslint-disable-line
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
        case 'DOT': {
            current = state.current;
            const lastLetter = current.slice(-1);
            if (lastLetter !== '.') {
                return Object.assign({}, state, {
                    current: `${state.current}.`,
                });
            }
        }
        default: //eslint-disable-line
            return state;
    }
}
