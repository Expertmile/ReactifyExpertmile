import React from 'react/lib/React'
import Helpful from './Helpful';
import LazyLoad from 'react-lazyload/lib/index';

export default function ({value, onHelpful, onImprove, index, auth, viewport960px, onCommentDelete}) {
    const commentStyle = {
        'position':   'relative',
        'float':      'left',
        'width':      '89%',
        'lineHeight': '22px',
        'fontSize':   '12px',
        'marginLeft': '5px'
    }
    const imageStyle = {
        'position':     'relative',
        'float':        'left',
        'borderRadius': '50%',
        'minWidth':     '20px'
    }

    const timeStyle = {
        'color':       '#0c7cd5',
        'fontSize':    '11.05px',
        'float':       'right',
        'marginLeft':  '5px',
        'marginRight': '5px',
        'marginTop':   '5px'
    }

    const helpBtn = {
        marginTop:  '-5px',
        marginLeft: '-5px',
        fontSize:   '8px'
    }

    const authorName = {
        'color':      '#ff5a5f',
        'fontWeight': 'bold'
    }
    const styles = require('../../scss/master.scss');
    return (
        <div>
        <LazyLoad height={0} throttle={200} once>
            <img
                src={value.get('ProfilePic') === null || '' ? '/timeline/images/blank.png' : '/' + value.get('ProfilePic')}
                width="25"
                height="25"
                style={imageStyle} />
        </LazyLoad>
            <div style={commentStyle}>
                <a href={'https://expertmile.com/newview.php?profID=' + value.get('ID')}><span style={authorName}> {value.get('Fname') + ' ' + value.get('Lname') }: </span></a>
                <span dangerouslySetInnerHTML={{ __html: value.get('Comment_Value') }} />
                { value.get('Comment_Creator') !== auth.get('id') && viewport960px ?
                    <div style={helpBtn}>
                        <Helpful value={value} index={index} onHelpful={onHelpful} onImprove={onImprove} />
                    </div> : 
                   viewport960px ? <div style={helpBtn}>
                    <button onClick={() => onCommentDelete(value.get('id'), index)} className={styles.mdl_helpful_button}>
                        <img src="/timeline/images/garbage.png" />
                        <span> Delete </span>
                    </button>
                    </div> : '' }
            </div>
            <span style={timeStyle}>{value.get('Time_Ago') }</span>
        </div>
    )
}
