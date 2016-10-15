import React from 'react/lib/React';

const Notification = () => {
    return (
        <div className="notification__panel">
            <div className="notification__panel_title">Get notified with every important update on Expertmile</div>
            <p>Get a push notification on your <span className="hidden_lg">mobile device</span> <span className="hidden_xs hidden_md hidden_sm">desktop</span> when somebody posts an important update on your timeline.</p>
            <center><button className="js-push-button">Subscribe</button></center>
        </div>
    )
}

export default Notification;