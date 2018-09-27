import React from 'react';
import Card from './card';

export default class Hand extends React.Component {
    render() {
        return (
            <div className="hand">
                {this.props.cards.map((card, i) =>
                    <Card suit={card.get('suit')}
                          rank={card.get('rank')}
                          faceDown={!(card.has('suit') && card.has('rank'))}
                          key={i} />
                )}
            </div>
        );
    }
};