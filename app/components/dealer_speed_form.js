import React from 'react';
import { reduxForm } from 'redux-form';
import { setSpeed } from '../action_creators';

const onSubmit = (values, dispatch) => {
    dispatch(setSpeed(parseInt(values.speed)));
};

export class DealerSpeedForm extends React.Component {
    render() {
        const speed = this.props.fields.speed;
        const handleSubmit = this.props.handleSubmit;
        const val = speed.value || this.props.initialSpeed;
        return (
            <div className="dealer-speed-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {[
                        ["Fast", 250],
                        ["Normal", 750],
                        ["Slow", 1500]
                    ].map((el) => (
                        <label key={el[1]}>
                            {el[0]}
                            <input type="radio"
                                   name="speed"
                                   {...speed}
                                   checked={val == el[1]}
                                   value={el[1]} />
                        </label>
                    ))
                    }
                    <input type="submit" />
                </form>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return { initialSpeed: state.settings.get('speed') };
};

export const DealerSpeedFormContainer = reduxForm({
    form: 'dealerSpeed',
    fields: ['speed']
}, mapStateToProps)(DealerSpeedForm);