import Immutable from 'immutable';

const defaultState = Immutable.Map({ show: true, currentPos: 0 });

export default function fab(state = defaultState, action) {
    switch(action.type) {
        case 'SHOW_FAB':
            return state.merge({show: true, currentPos: action.pos});

        case 'HIDE_FAB':
            return state.merge({show: false, currentPos: action.pos});

        default:
            return state;
    }
}