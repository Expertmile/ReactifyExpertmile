import Immutable from 'immutable';

const defaultState = Immutable.Map({ loading: 0, currentPage: 1 });

export default function paginateArticles(state = defaultState, action) {
	switch(action.type){
		case 'LOAD_MORE_ARTICLES_REQUEST':
			return state.set('loading', 1);
			
		case 'LOAD_MORE_ARTICLES':
			return state.merge({ loading: 0, currentPage: state.get('currentPage') + 1 });
			
		case 'LOAD_MORE_ARTICLES_FAILURE':
			return state.set('loading', 1);
			
		default:
			return state;
	}
}