import React from 'react';
import { reduxForm } from 'redux-form';

import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DealerSpeedForm }
    from '../../app/components/dealer_speed_form';

describe('<DealerSpeedForm />', () => {
    const props = {
        fields: { speed: { } },
        handleSubmit: () => { },
        initialSpeed: 750
    };
    const rendered = shallow(<DealerSpeedForm {...props} />);

    it('renders three radio buttons', () => {
        expect(rendered).to.have.exactly(3)
            .descendants('input[type="radio"]');
    });

    it('gives correct speeds to radio buttons', () => {
        const radios = rendered.find('input[type="radio"]');
        expect(radios.map((el) => el.prop('value'))).to
            .eql([250, 750, 1500]);
    });

    it('checks button with initial value', () => {
        const initial = rendered.find('input[value=750]');
        expect(initial.prop('checked')).to.eq(true);
    });
});