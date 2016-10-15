import React            from 'react/lib/React';
import ReactDOM         from 'react-dom';


export default class InputComment extends React.Component{
    constructor(props) {
        super(props);
        this.state= {commentButton: false}
    }

    emitChange = () => {
        this.setState({commentButton: true});
        var html = ReactDOM.findDOMNode(this.refs.content).innerText;
        this.props.onChange(html);
    }
    
    changeButton = () => {
        this.setState({commentButton: true});
    }
    
    handleSubmit = () => {
        if(ReactDOM.findDOMNode(this.refs.content).innerText.length >= 2){
            this.props.onSubmit();
            ReactDOM.findDOMNode(this.refs.content).innerText = '';
        }
    }
    
    render() {
        const styles = require('../../scss/master.scss');
        return (
            <div>
                <div id="editor" 
                    onBlur={this.emitChange}
                    onClick={this.changeButton}
                    onInput={this.emitChange}
                    contentEditable={true} 
                    className={styles.editor}
                    placeholder='Add a comment..'
                    ref='content'
                    spellCheck={true} />
                    {this.state.commentButton ? <button className={styles.commentbtn} onClick={this.handleSubmit}>comment</button> : null }
            </div>
        )
    }  
} 

