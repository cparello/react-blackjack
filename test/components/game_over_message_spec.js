import React from 'react';
import { expect } from 'chai';
import { shallow, simulate } from 'enzyme';
import sinon from 'sinon';
import { GameOverMessage } from '../../app/components/game_over_message';

describe('<GameOverMessage />' , () => {
    describe('for win', () => {
        const rendered = shallow(<GameOverMessage win={true} />);

        it('displays message', () => {
            expect(rendered).to.include.text('You win!');
        });
    });

    describe('for loss', () => {
        const rendered = shallow(<GameOverMessage  win={false} />);

        it('displays message', () => {
            expect(rendered).to.include.text('You lose :(');
        });
    });

    describe('for draw', () => {
        const rendered = shallow(<GameOverMessage win={undefined} />);

        it('displays message', () => {
            expect(rendered).to.include.text('Tie game.');
        });
    });
    describe('next game button', () => {
        it('triggers callback when button is pressed', () => {
            const nextGameSpy = sinon.spy();
            const rendered = shallow(<GameOverMessage nextGame={nextGameSpy} />);

            rendered.find('button').simulate('click');
            expect(nextGameSpy.calledOnce).to.eq(true);
        });
    });
});