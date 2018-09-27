import { expect } from 'chai';
import { Map } from 'immutable';

import reducer from '../../app/reducers/settings';
import { setSpeed } from '../../app/action_creators';

describe('settings reducer', () => {
    describe('SET_SPEED', () => {
        const action = setSpeed(100);

        context('with undefined initial state', () => {
            const initialState = undefined;
            it('sets speed', () => {
                const nextState = reducer(initialState, action);
                expect(nextState.get('speed')).to.eq(100);
            });
        });

        context('with existing initial state', () => {
            const initialState = new Map({speed: 750});
            it('sets speed', () => {
                const nextState = reducer(initialState, action);
                expect(nextState.get('speed')).to.eq(100);
            });
        });
    });
});