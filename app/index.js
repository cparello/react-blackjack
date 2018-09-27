import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { AppContainer } from './components/app';
import { fromJS, Map  } from 'immutable';
import reducer from './reducers/index';
import { setupGame, setRecord } from '../app/action_creators';
import watchActions from './sagas/index';
import { newDeck, deal } from './lib/cards';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Settings} from "./components/settings";

require('./css/main.scss');

const sagaMiddleware = createSagaMiddleware();
const initialState = { settings: new Map({speed: 750}) };

let store = createStore(reducer, initialState, compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ?
        window.devToolsExtension() : f => f
));
sagaMiddleware.run(watchActions);

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(setRecord(0, 0));
store.dispatch(setupGame());


let deck = newDeck();
let playerHand, dealerHand;

[deck, playerHand] = deal(deck, 2);
[deck, dealerHand] = deal(deck, 1);
dealerHand = dealerHand.push(new Map());

const state = fromJS({
    deck,
    playerHand,
    dealerHand,
    "winCount": 0,
    "lossCount": 0,
    hasStood: false
});

console.log(state);


ReactDOM.render(<Provider store={store}>
                    <Router history={history}>
                        <Route path="/" component={AppContainer} />
                        <Route path="/settings" component={Settings} />

                    </Router>
                </Provider>,
    document.getElementById('app'));