import React from 'react/lib/React';

export default function Helpful ({value, onHelpful, onImprove, index}) {
    const styles = require('../../scss/master.scss');

    return (
        <div>
        { value.get('helpfuluser') === null ?
            <div>
                <button onClick={() => onHelpful(value.get('id'), index, value.get('helpful'), value.get('nothelpful')) } className={styles.mdl_helpful_button}>
                    <img src="/timeline/images/helpful.png" width="24" height="24"/>
                    <span> Helpful | {value.get('helpful') } </span>
                </button>
                <button onClick={() => onImprove(value.get('id'), index, value.get('helpful'), value.get('nothelpful')) } className={styles.mdl_helpful_button}>
                    <img src="/timeline/images/nothelpful.png" width="24" height="24"/>
                    <span> Improve | {value.get('nothelpful') } </span>
                </button>
            </div> : '' }

            { value.get('helpfuluser') === 1 ?
            <div>
                <button className={styles.mdl_helpful_button_fill}>
                    <img src="/timeline/images/helpful.png" width="24" height="24"/>
                    <span> Helpful | {value.get('helpful') } </span>
                </button>
                <button onClick={() => onImprove(value.get('id'), index, value.get('helpful'), value.get('nothelpful')) } className={styles.mdl_helpful_button}>
                    <img src="/timeline/images/nothelpful.png" width="24" height="24"/>
                    <span> Improve | {value.get('nothelpful') } </span>
                </button>
            </div> : '' }

            { value.get('helpfuluser') === 2 ?
            <div>
                <button onClick={() => onHelpful(value.get('id'), index, value.get('helpful'), value.get('nothelpful')) } className={styles.mdl_helpful_button}>
                    <img src="/timeline/images/helpful.png" width="24" height="24"/>
                    <span> Helpful | {value.get('helpful') } </span>
                </button>
                <button className={styles.mdl_helpful_button_fill}>
                    <img src="/timeline/images/nothelpful.png" width="24" height="24"/>
                    <span> Improve | {value.get('nothelpful') } </span>
                </button>
            </div> : '' }
        </div>
    )
}