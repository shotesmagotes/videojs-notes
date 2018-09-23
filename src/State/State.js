/**
 * @file state.js
 */

import videojs from 'video.js';
import { toTitleCase } from '../utils';

const Dom = videojs.dom;
const Log = videojs.log;
const bind = videojs.bind;
const mergeOptions = videojs.mergeOptions;

class State {
	constructor(context, options) {
		
		this.options_ = mergeOptions({}, this.options_);
		options = this.options_ = mergeOptions(this.options_, options);
		
		this.context_ = context;
		this.style_ = context.el().style;
		
		this.name_ = options.name || null;	
		
		context.on('dispose', bind(this, this.disposeState));
	}
	
	/**
	 * Called by context to bind event handlers
	 * 
	 * @method bindState
	 */
	bindState() {}
	
	/**
	 * Disposes the states internal state and variables
	 *
	 * @method disposeState
	 */
	disposeState() {}
	
	/**
	 * Returns the name of the state
	 * 
	 * @return {String}
	 * @method name
	 */
	name() {
		return this.name_;
	}
	
	/**
	 * To be implemented by subclass
	 *
	 * @param {Event} event
	 * @method handleClick
	 */
	handleClick(event) {}
	
	/**
	 * To be implemented by subclass
	 * override if necessary 
	 *
	 * @param {Event} event
	 * @method handleMouseDown
	 */
	handleMouseDown(event) {
		const context = this.context_;
		const doc = context.el().ownerDocument;
		Dom.blockTextSelection();
		
		context.on(doc, 'mousemove', Fn.bind(this, this.handleMouseMove));
    context.on(doc, 'mouseup', Fn.bind(this, this.handleMouseUp));
    context.on(doc, 'touchend', Fn.bind(this, this.handleMouseUp));
		
		this.handleMouseMove(event);
	}
	
	/**
	 * To be implemented by subclass
	 *
	 * @param {Event} event
	 * @method handleMouseMove
	 */
	handleMouseMove(event) {}
	
	/**
	 * To be implemented by subclass
	 *
	 * @param {Event} event
	 * @method handleUp
	 */
	handleMouseUp(event) {
		const context = this.context_;
		const doc = context.el().ownerDocument;		
    Dom.unblockTextSelection();
    
    context.off(doc, 'mousemove', Fn.bind(this, this.handleMouseMove));
    context.off(doc, 'mouseup', Fn.bind(this, this.handleMouseUp));
    context.off(doc, 'touchend', Fn.bind(this, this.handleMouseUp));
	}
	
	/**
	 * Adds a state to the private states object
	 * 
	 * @param {String} name Name of the state
	 * @param {Class} state State class
	 * @return {Object}
	 * @method registerState
	 */
	static registerState(name, state) {
		if (!name) {
      return;
    }

    name = toTitleCase(name);

    if (!State.states_) {
      State.states_ = {};
    }
		
    State.states_[name] = state;

    return state;
	}
	
	/**
	 * Returns a specific state class
	 *
	 * @return {Object}
	 * @method getStates
	 */
	static getState(name) {
		if (!name && !State.states_) {
			return;
		}
		
		name = toTitleCase(name);
		
		if (State.states_[name]) {
			return State.states_[name];	
		} else {
			Log.Error('Cannot find state in registered states: ', name);
		}
	}
	
	/**
	 * Returns the states_ object
	 *
	 * @return {Object}
	 * @method getStates
	 */
	static getStates() {
		return State.states_;	
	}
}

export default State;
