import React from 'react';
import { connect } from 'react-redux';
import { setupGame } from '../action_creators';

export class GameOverMessage extends React.Component {
    render() {
        let message;

        if(this.props.win === undefined) {
            message = "Tie game.";
        } else if(this.props.win === true) {
            message = "You win!";
        } else {
            message = "You lose :(";
        }

        return (
            <div id="game_over_message">
                { message }
                <button onClick={this.props.nextGame}>Next Game</button>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        nextGame: () => dispatch(setupGame())
    };
}

export const GameOverMessageContainer = connect(undefined, mapDispatchToProps)(GameOverMessage);