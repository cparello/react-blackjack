import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, simulate } from 'enzyme';

import { Info } from '../../app/components/info';

describe('<Info />', () => {
    describe('when hasStood is false', () => {
        const onClickHitSpy = sinon.spy();
        const onClickStandSpy = sinon.spy();

        const rendered = shallow(<Info winCount={1}
                                       lossCount={2}
                                       hasStood={false}
                                       onClickHit={onClickHitSpy}
                                       onClickStand={onClickStandSpy}
                                        />);

        it('displays record', () => {
            expect(rendered).to.include.text("Wins: 1");
            expect(rendered).to.include.text("Losses: 2");
        });

        const buttons = rendered.find('button');
        it('shows hit and stand buttons', () => {
            expect(buttons).to.have.length(2);
            expect(buttons.first()).to.have.text('Hit');
            expect(buttons.last()).to.have.text('Stand');
        });

        it('enables hit and stand buttons', () => {
            buttons.forEach((b) => {
                expect(b).to.not.have.attr('disabled');
            });
        });
        it('invokes prop function when Hit is clicked', () => {
            buttons.first().simulate('click');
            expect(onClickHitSpy.calledOnce).to.eq(true);
        });
        it('invokes prop function when Stand is clicked', () => {
            buttons.last().simulate('click');
            expect(onClickStandSpy.calledOnce).to.eq(true);
        });
    });

    describe('when hasStood is true', () => {
        const rendered = shallow(<Info winCount={1} lossCount={2} hasStood={true} />);

        it('disables hit and stand buttons', () => {
            const buttons = rendered.find('button');
            buttons.forEach((b) => {
                expect(b).to.have.attr('disabled');
            });
        });
    });
    describe('when gameOver is true', () => {
        const rendered = shallow(<Info gameOver={true} />);

        it('disables hit and stand buttons', () => {
            const buttons = rendered.find('button');
            buttons.forEach((b) => {
                expect(b).to.have.attr('disabled');
            });
        });
    });
});