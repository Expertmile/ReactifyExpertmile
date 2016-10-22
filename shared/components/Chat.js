import React                                    from 'react/lib/React'
import ReactDOM                                 from 'react-dom'
import connect                                  from 'react-redux/lib/components/connect';
import ImmutablePropTypes                       from 'react-immutable-proptypes';
import fetchData                                from '../lib/fetchDataDeferred';
import browserHistory                           from 'react-router/lib/browserHistory';
import $                                        from 'jquery/dist/jquery.slim.min.js';
import * as ChatActions                      from '../actions/ChatAction';
import Header                                   from './presentational/Header';
import passiveEventListeners                    from './listeners/supportForPassiveListener';
import { selectDetailedArticle, isEditable }    from '../reducers/ChatReducer';
import StatusLoader                             from './presentational/StatusLoader';
import ArticleDetailView                        from './presentational/ArticleDetailView';
import toasterInstance	                        from '../instances/ToasterInstance';
import Toaster                                  from './Toaster';
import asyncToasterInstance	                    from '../instances/AsyncToasterInstance';

@connect(state => ({
    ChatReducer:                       state.ChatReducer,
  
}),
    ChatActions
)
@fetchData((state, dispatch) =>  dispatch(ChatActions.LoadChat()))


export default class Chat extends React.Component {
    
    constructor() {
        super();
    }

    
    render() {
        console.log(this.props.ChatReducer);
        return (
            <div>
            <h1>welcome to expertmile.com</h1>
            </div>
        )
    }
}