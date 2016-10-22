import Immutable from 'immutable';
import { isAuthenticated }    from '../reducers/AuthReducer';
const defaultState = Immutable.Map();

export default function Chat(state = defaultState, action) {
  switch (action.type) {
    case 'LOAD_CHAT':
      return Immutable.fromJS(action.res.data);

    case 'LOAD_MORE_ARTICLES':
			return state.merge(action.res.data);

    default:
      return state;
  }
}

export const isEditable = (state) => isAuthenticated(state);
export const selectArticle = (state, id) => state.articles.get(id)