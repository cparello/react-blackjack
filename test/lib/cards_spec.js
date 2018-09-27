import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';

import { newDeck, deal, score } from '../../app/lib/cards';

describe('cards.js', () => {
    describe('newDeck', () => {
        it('returns an immutable list', () => {
            expect(newDeck()).to.be.instanceOf(List);
        });
        it('has 52 elements', () => {
            expect(newDeck().size).to.eq(52);
        });
        it('returns same deck with same seed', () => {
            expect(newDeck(1)).to.eq(newDeck(1));
        });

        it('returns different deck with different seeds', () => {
            expect(newDeck(1)).not.to.eq(newDeck(2));
        });
    });
    describe('deal()', () => {
        const deck = newDeck();
        const n = 5;
        const [new_deck, new_hand] = deal(deck, n);

        it('returns smaller deck', () => {
            expect(new_deck.size).to.eq(52 - n);
        });

        it('returns hand of n cards', () => {
            expect(new_hand.size).to.eq(n);
        });

        it('does not deal same card each time', () => {
            const cards = [];
            for(let i = 0; i < 10; i += 1) {
                cards.push(deal(deck, 1)[1].first());
            }
            const all_same = cards.reduce( (prev, curr) => prev && (cards[0] === curr), true );
            expect(all_same).to.eq(false);
        });
        it('deals same card each time with same seed', () => {
            const cards = [];
            for(let i = 0; i < 10; i += 1) {
                cards.push(deal(deck, 1, 1)[1].first());
            }
            const all_same = cards.reduce( (prev, curr) => prev && (cards[0] === curr), true );
            expect(all_same).to.eq(true);
        });

        it('does not deal same card each time with different seeds', () => {
            const cards = [];
            for(let i = 0; i < 10; i += 1) {
                cards.push(deal(deck, 1, i)[1].first());
            }
            const all_same = cards.reduce( (prev, curr) => prev && (cards[0] === curr), true );
            expect(all_same).to.eq(false);
        });
    });
    describe('score()', () => {
        describe('with numeric ranks', () => {
            it('calculates correct score', () => {
                let hand = fromJS([{rank: 3}, {rank: 5}]);
                expect(score(hand)).to.eq(8);
                hand = fromJS([{rank: 2}, {rank: 9}]);
                expect(score(hand)).to.eq(11);
            });
        });
        describe('with face cards', () => {
            it('calculates correct score', () => {
                let hand = fromJS([{rank: 3}, {rank: 'K'}]);
                expect(score(hand)).to.eq(13);
                hand = fromJS([{rank: 'Q'}, {rank: 'J'}]);
                expect(score(hand)).to.eq(20);
            });
        });
        describe('with aces', () => {
            it('counts aces as 11 for hands less than 21', () => {
                const hand = fromJS([{rank: 3}, {rank: 'A'}]);
                expect(score(hand)).to.eq(14);
            });

            it('counts aces as 11 for hands equal to 21', () => {
                let hand = fromJS([{rank: 10}, {rank: 'A'}]);
                expect(score(hand)).to.eq(21);
                hand = fromJS([{rank: 'A'}, {rank: 'K'}]);
                expect(score(hand)).to.eq(21);
            });

            it('counts aces as 1 for hands greater than 21', () => {
                let hand = fromJS([{rank: 3}, {rank: 'A'}, {rank: 9}]);
                expect(score(hand)).to.eq(13);
                hand = fromJS([{rank: 'K'}, {rank: 'K'}, {rank: 'A'}]);
                expect(score(hand)).to.eq(21);
            });

            it('works with multiple aces', () => {
                let hand = fromJS([{rank: 'A'}]);
                expect(score(hand)).to.eq(11);
                hand = hand.push(new Map({rank: 'A'}));
                expect(score(hand)).to.eq(12);
                hand = hand.push(new Map({rank: 'A'}));
                expect(score(hand)).to.eq(13);
                hand = hand.push(new Map({rank: 'A'}));
                expect(score(hand)).to.eq(14);
                hand = fromJS([{rank: 'A'}, {rank: 'K'}, {rank: 'A'}]);
                expect(score(hand)).to.eq(12);
            })
        });
    });
});