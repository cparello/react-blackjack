import React from 'react';
import { InfoContainer } from './info';
import Hand from './hand';
import { connect } from 'react-redux';
import { GameOverMessageContainer  } from './game_over_message';
import { Link } from 'react-router';


export class App extends React.Component {
    render() {
        let messageComponent;
        if(this.props.gameOver) {
            messageComponent = <GameOverMessageContainer  win={this.props.playerWon} />;
        }
        return (
            <div className="app">
                <div className="links">
                    <Link to="/settings">Settings</Link>
                </div>
                <h1>React Blackjack</h1>
                <InfoContainer />
                { messageComponent }
                <strong>Player's hand:</strong>
                <Hand cards={this.props.playerHand } />
                <strong>Dealer's hand:</strong>
                <Hand cards={this.props.dealerHand } />
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        playerHand: state.game.get('playerHand'),
        dealerHand: state.game.get('dealerHand'),
        gameOver: state.game.get('gameOver'),
        playerWon: state.game.get('playerWon')
    };
}

export const AppContainer = connect(mapStateToProps)(App);