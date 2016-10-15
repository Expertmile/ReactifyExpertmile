import Immutable from 'immutable';

const defaultState = Immutable.Map({ loaded: false, user: null, id: null, category: null, loggingIn: false, error: false });

export default function auth(state = defaultState, action = {}) {
  switch (action.type) {
    case 'LOAD_AUTH':
      return state.merge({ loaded: true, id: action.res.data.id || null, user: action.res.data.name || null, category: action.res.data.category || null });
    
    case 'RESET_AUTH':
      return state.merge({ loaded: false, user: null, id: null, category: null, loggingIn: false, error: false });
      
    default:
      return state;
  }
}

// Selectors:

export const isLoaded = (state) => state.auth.get('loaded');
export const isAuthenticated = (state) => !!state.auth.get('user');