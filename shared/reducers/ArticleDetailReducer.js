import Immutable from 'immutable';
import { isAuthenticated }    from '../reducers/AuthReducer';
const defaultState = Immutable.Map();

export default function articleDetail(state = defaultState, action) {
    switch(action.type) {
        case 'LOAD_DETAILED_ARTICLE':
            return Immutable.fromJS(action.res.data);
        
        case 'LOAD_MORE_DETAILED_ARTICLE':
            return state.merge(action.res.data);

        case 'POST_NEW_COMMENT':
          return state
				.updateIn([action.artiID, 'comments'], val => val.insert(val.size, Immutable.fromJS(action.res.data)))
                .updateIn([action.artiID], val => val.set('comment_count', val.get('comment_count') + 1));
        default:
            return state;
    }
}

export const isEditable = (state) => isAuthenticated(state);
export const selectDetailedArticle = (state, id) => state.articleDetail.get(id)