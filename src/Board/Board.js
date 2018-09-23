/**
 * Board class 
 *		Interface that connects state behavior
 *		to the Mark Collection board, which is
 *		the actual UI object accessible to users
 *
 * @file board.js
 */

import videojs from 'video.js';
import State from '../State';
import { MarkCollection } from '../Mark';

const Component = videojs.getComponent('Component');
const Log = videojs.log;
const mergeOptions = videojs.mergeOptions;
const Dom = videojs.Dom;

/**
 * Overalys element over the player seek bar in order to prevent triggering of seek bar events
 * Adds state dependent behavior for selecting and creating notes on the seekbar
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * 				options.order flag sets whether to automatically order states based on initialization
 *				order
 *
 * @extends MarkCollection
 * @Board
 */

class Board extends MarkCollection {
  constructor(player, options) {
    options = mergeOptions(Board.prototype.options, options);
    super(player, options);
    
		// state name to state instance dict
		this.states = {};
		
		// holds current state
		this.currentState = null;
		
		// keeps the order of the states if sequential
		this.nextState = {};
		
		// adds states from the State array and initializes order
		let initialOrder = [];
		for (let state in State.getStates()) {			
			this.addState(state, State.getState(state));
			initialOrder.push(state);
		}
		
		if (!options.order) {
			this.setStateOrder(initialOrder);
			let firstState = Object.keys(this.states)[0];
			this.setDefaultState(firstState);
		} else {
			this.setStateOrder(options.order);
			this.setDefaultState(options.order[0])
		}
			
		initialOrder = null;
  }
 
	/**
	 * Sets the default state and swaps 
	 * 
	 * @param {String=} name Name of state
	 * @method setDefaultState
	 */
	setDefaultState(name) {
		if (!this.states) {
			return;
		}
		
		this.currentState = this.states[name];
		
		return this.states[name];
	}
	
	/**
	 * Add state to the Board
	 * 
	 * @param {Class} state The class for the state
	 * @method addState
	 */
	addState(name, StateClass, options) {
		if (!State.isPrototypeOf(StateClass)) {
			Log.error("State should contain a name property.");
		}
		
		if (!options) {
			options = {};
		}
		
		let state = new StateClass(this, options);
		this.states[name] = state;
	}
  
	/**
	 * Binds the Board events to state's event handlers
	 *
	 * @method bindEventsToState
	 */
	bindEvents() {
		const state = this.currentState;
		Dom.unblockTextSelection();
		
		state.bindState();
		this.triggerReady();
	}
	
	/**
	 * Converts an array describing state order to the private order data structure
	 * 
	 * @param {Array} order Ordered array
	 * @method setStateOrder 
	 */
	setStateOrder(order) {
		if (!this.nextState) {
			this.nextState = {};
		}  
		
		let orderLen = order.length;
		for (let i = 0; i < orderLen; i++) {
			let state = order[i]
			let next = order[(i+1) % orderLen];
			
			if (!this.states[state]){
				Log.error("The following state is not registered with the States class: ", state);
			}
			
			this.nextState[state] = next;
		}
	}
	
	/**
	 * Goes to the next state
	 *
	 * @method goToNextState
	 */
	goToNextState() {
		let current = this.currentState.name();
		this.currentState.disposeState();
		
		let next = this.nextState[current];
		
		this.currentState = this.states[next];
		
		this.bindEvents();
		return this.currentState;
	}
}

Board.prototype.options_ = {
	name: 'Board',
	reportTouchActivity: false
}

Component.registerComponent('Board', Board);
export default Board;