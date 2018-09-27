import { Map, List, fromJS } from 'immutable';
import { expect } from 'chai';
import { setupGame, setRecord, dealToPlayer, stand, dealToDealer, determineWinner } from '../../app/action_creators';
import { newDeck } from '../../app/lib/cards';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import reducer from '../../app/reducers/game';

const reducerPath = '../../app/reducers/game';
const cardsPath = '../lib/cards';

describe('reducer', () => {
    describe("SETUP_GAME", () => {
        const action = setupGame();
        const cardUtils = { };
        const stubbedReducer = proxyquire(
            reducerPath,
            {[cardsPath]: cardUtils}
        ).default;

        describe("when not dealt winning hand", () => {
            cardUtils.score = () => 10;

            describe("with empty initial state", () => {
                const initialState = undefined;
                const nextState = stubbedReducer(initialState, action);

                it('sets up deck', () => {
                    expect(nextState.get('deck').size).to.eq(49);
                });

                it('sets up playerHand', () => {
                    expect(nextState.get('playerHand').size).to.eq(2);
                });

                it('sets up dealerHand', () => {
                    expect(nextState.get('dealerHand').size).to.eq(2);
                    expect(nextState.get('dealerHand').last()).to.eq(new Map());
                });

                it('sets up hasStood', () => {
                    expect(nextState.get('hasStood')).to.eq(false);
                });

                it('sets up gameOver', () => {
                    expect(nextState.get('gameOver')).to.eq(false);
                });

                it('sets up playerWon', () => {
                    expect(nextState.get('playerWon')).to.eq(undefined);
                });
            });

            describe("with existing initial state", () => {
                const initialState = new Map({'winCount': 10, 'lossCount': 7, 'deck': 'fake deck'});
                const nextState = stubbedReducer(initialState, action);

                it('adds new variables', () => {
                    expect(Array.from(nextState.keys())).to.include(
                        'deck', 'playerHand', 'dealerHand',
                        'hasStood', 'gameOver', 'playerWon'
                    );
                });

                it('keeps old variables', () => {
                    expect(nextState.get('winCount')).to.eq(10);
                    expect(nextState.get('lossCount')).to.eq(7);
                });

                it('overwrites old variables', () => {
                    expect(nextState.get('deck')).not.to.eq('fake deck');
                });
            });
        });
        describe("with empty initial state", () => {
            const initialState = undefined;
            const nextState = reducer(initialState, action);

            it('sets up deck', () => {
                expect(nextState.get('deck').size).to.eq(49);
            });

            it('sets up playerHand', () => {
                expect(nextState.get('playerHand').size).to.eq(2);
            });

            it('sets up dealerHand', () => {
                expect(nextState.get('dealerHand').size).to.eq(2);
                expect(nextState.get('dealerHand').last()).to.eq(new Map());
            });

            it('sets up hasStood', () => {
                expect(nextState.get('hasStood')).to.eq(false);
            });
            it('sets up gameOver', () => {
                expect(nextState.get('gameOver')).to.eq(false);
            });

            it('sets up playerWon', () => {
                expect(nextState.get('playerWon')).to.eq(undefined);
            });
        });

        describe("with existing initial state", () => {
            const initialState = new Map({'winCount': 10, 'lossCount': 7, 'deck': 'fake deck'});
            const nextState = reducer(initialState, action);

            it('adds new variables', () => {
                expect(Array.from(nextState.keys())).to.include('deck', 'playerHand', 'dealerHand', 'hasStood', 'gameOver', 'playerWon');
            });

            it('keeps old variables', () => {
                expect(nextState.get('winCount')).to.eq(10);
                expect(nextState.get('lossCount')).to.eq(7);
            });

            it('overwrites old variables', () => {
                expect(nextState.get('deck')).not.to.eq('fake deck');
            });
        });
        describe("when dealt winning hand", () => {
            const cardUtils = { };
            const stubbedReducer = proxyquire(
                reducerPath,
                {[cardsPath]: cardUtils}
            ).default;
            cardUtils.score = () => 21;

            const initialState = undefined;
            const nextState = stubbedReducer(initialState, action);

            it('sets gameOver and playerWon', () => {
                expect(nextState.get('gameOver')).to.eq(true);
                expect(nextState.get('playerWon')).to.eq(true);
            });
            it('increments winCount', () => {
                expect(nextState.get('winCount')).to.eq(1);
            });
        });
    });
    describe("SET_RECORD", () => {
        const action = setRecord(3, 2);
        const initialState = new Map({'winCount': 10, 'lossCount': 7, 'deck': 'fake deck'});
        const nextState = reducer(initialState, action);

        it('sets winCount and lossCount', () => {
            expect(nextState.get('winCount')).to.eq(3);
            expect(nextState.get('lossCount')).to.eq(2);
        });

        it('keeps old variables', () => {
            expect(nextState.get('deck')).to.eq('fake deck');
        });
    });
    describe("DEAL_TO_PLAYER", () => {
        const action = dealToPlayer();
        const initialState = new Map({"playerHand": new List(), "deck": newDeck()});
        const nextState = reducer(initialState, action);

        it('adds one card to player hand', () => {
            expect(nextState.get('playerHand').size).to.eq(initialState.get('playerHand').size + 1);
        });

        it('removes one card from deck', () => {
            expect(nextState.get('deck').size).to.eq(initialState.get('deck').size - 1);
        });
        describe("when player gets more than 21 points", () => {
            const initialState = fromJS({
                "playerHand": [{rank: 'K'}, {rank: 'Q'}],
                "deck": fromJS([{rank: 'J'}]),
                "lossCount": 0
            });
            const nextState = reducer(initialState, action);

            it('increases loss count by 1', () => {
                expect(nextState.get('lossCount')).to.eq(initialState.get('lossCount') + 1);
            });
            it('toggles gameOver and sets playerWon', () => {
                expect(nextState.get('gameOver')).to.eq(true);
                expect(nextState.get('playerWon')).to.eq(false);
            });
        });

    });
    describe("DEAL_TO_DEALER", () => {
        const action = dealToDealer();

        const initialState = new Map({
            "dealerHand": new List(),
            "deck": newDeck()
        });

        const nextState = reducer(initialState, action);

        it('adds one card to dealer hand', () => {
            expect(nextState.get('dealerHand').size).to
                .eq(initialState.get('dealerHand').size + 1);
        });

        it('removes one card from deck', () => {
            expect(nextState.get('deck').size).to
                .eq(initialState.get('deck').size - 1);
        });
    });
    describe("STAND", () => {
        const action = stand();

        const initialState = fromJS({
            "hasStood": false,
            dealerHand: [{ suit: 'S', rank: 'K' }, {}]
        });

        const nextState = reducer(initialState, action);

        it('sets hasStood to true', () => {
            expect(nextState.get('hasStood')).to.eq(true);
        });

        it('removes dummy card', () => {
            expect(nextState.get('dealerHand').size).to
                .eq(1);
        });
    });

    describe("DETERMINE_WINNER", () => {
        const action = determineWinner();
        const cardUtils = { };
        const stubbedReducer = proxyquire(
            reducerPath,
            {[cardsPath]: cardUtils}
        ).default;

        const initialState = new Map({
            "hasStood": false,
            dealerHand: new List(),
            playerHand: new List(),
            winCount: 11,
            lossCount: 15
        });

        beforeEach( () => {
            cardUtils.score = sinon.stub();
            cardUtils.deal = sinon.stub();
            cardUtils.deal.returns([new List(), new List()]);
        });

        it('increments win count and sets playerWon if player wins', () => {
            cardUtils.score.onCall(0).returns(20); // user score
            cardUtils.score.onCall(1).returns(17); // dealer score

            const nextState = stubbedReducer(initialState, action);

            expect(nextState.get('winCount')).to.eq(initialState.get('winCount') + 1);
            expect(nextState.get('lossCount')).to.eq(initialState.get('lossCount'));
            expect(nextState.get('playerWon')).to.eq(true);
        });

        it('increments win count and sets playerWon if dealer busts', () => {
            cardUtils.score.onCall(0).returns(20); // user score
            cardUtils.score.onCall(1).returns(22); // dealer score

            const nextState = stubbedReducer(initialState, action);

            expect(nextState.get('winCount')).to.eq(initialState.get('winCount') + 1);
            expect(nextState.get('lossCount')).to.eq(initialState.get('lossCount'));
            expect(nextState.get('playerWon')).to.eq(true);
        });

        it('increments loss count and sets playerWon if dealer wins', () => {
            cardUtils.score.onCall(0).returns(16); // user score
            cardUtils.score.onCall(1).returns(17); // dealer score

            const nextState = stubbedReducer(initialState, action);

            expect(nextState.get('winCount')).to.eq(initialState.get('winCount'));
            expect(nextState.get('lossCount')).to.eq(initialState.get('lossCount') + 1);
            expect(nextState.get('playerWon')).to.eq(false);
        });

        it('does not change counts if tie', () => {
            cardUtils.score.onCall(0).returns(17); // user score
            cardUtils.score.onCall(1).returns(17); // dealer score

            const nextState = stubbedReducer(initialState, action);

            expect(nextState.get('winCount')).to.eq(initialState.get('winCount'));
            expect(nextState.get('lossCount')).to.eq(initialState.get('lossCount'));
            expect(nextState.get('playerWon')).to.eq(undefined);
        });
    });
});