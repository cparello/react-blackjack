import React from 'react';
import { Link } from 'react-router';
import { DealerSpeedFormContainer }    from './dealer_speed_form';

export class Settings extends React.Component {
    render() {
        return (
            <div id="settings">
                <div className="links">
                    <Link to="/">Back to game</Link>
                </div>
                <h1>Settings</h1>
                <DealerSpeedFormContainer />
            </div>
        );
    }
}