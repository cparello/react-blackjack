import React from 'react';
import { connect } from 'react-redux';
import { dealToPlayer, stand } from '../../app/action_creators';

export class Info extends React.Component {
    render() {
        let disableButtons = false;
        if(this.props.hasStood || this.props.gameOver) {
            disableButtons = true;
        }
        return (
            <div id="info">
                <span id="player_record">
                    Wins: {this.props.winCount} Losses: {this.props.lossCount}
                </span>
                <span id="buttons">
                   <button disabled={disableButtons}
                           onClick={this.props.onClickHit}>
                       Hit
                   </button>
                   <button disabled={disableButtons}
                           onClick={this.props.onClickStand}>
                       Stand
                   </button>
               </span>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        winCount: state.game.get('winCount'),
        lossCount: state.game.get('lossCount'),
        hasStood: state.game.get('hasStood'),
        gameOver: state.game.get('gameOver')
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        onClickHit: () => {
            dispatch(dealToPlayer())
        },
        onClickStand: () => {
            dispatch(stand());
        }
    }
}

export const InfoContainer = connect(mapStateToProps, mapDispatchToProps)(Info);
