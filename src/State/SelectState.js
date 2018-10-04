/**
 * @file select-state.js
 */
import * as Logic from '../logic/occlusion.js'
import State from './State.js';

/**
 * Handles events for selecting marks
 * 
 * @param {Player|Object} player
 * @param {Object=} options
 * @class SelectState
 */
class SelectState extends State {
	constructor(context, options) {
		super(context, options);
	}
	
	/**
	 * Binds the events to the context 
	 * 		called on state changes
	 * 
	 * @method bindState
	 */
	bindState() {
		this.context_.addClass('ntk-select-state');

		const context = this.context_;
		const target = context.contentEl();
	}
	
	/**
	 * Disposes of state properties
	 *
	 * @method disposeState
	 */
	disposeState() {
		this.context_.removeClass('ntk-select-state');
	}
	
  /**
	 * Stops propogation if target is this
	 *
	 * @param {Event} event
	 * @method handleClick
	 */
	handleClick(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	
	/**
   * Triggers the mark start event for a new active mark
   * 
   * @param {Object} event Event object
   * @method handleMouseDown
   */
  handleMouseDown(event) {
    event.preventDefault();
		event.stopImmediatePropagation();
  }
  
  /**
   * Draws the highlighted segment by calling Marks API
   *
   * @param {Event} event
   * @method handleMouseMove
   */
  handleMouseMove(event){
		Logic.update();
		
    event.preventDefault();
		event.stopImmediatePropagation();
  }
  
  /**
   * Triggers the mark end event for the active mark
   *
   * @param {Object} event Event object
   * @method handleMouseUp
   */
  handleMouseUp(event) {
    event.preventDefault();
		event.stopImmediatePropagation();
  }
	
	/**
	 * Handles mark item click - relies on bubbling
	 *
	 * @param {Event} event Event object
	 * @method handleItemClick
	 */
	handleItemClick(event) {
		// do something.. 
		
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	
	/**
	 * Handles mark item hover
	 */
	handleItemHover(event) {
		// do something..
		
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}

SelectState.prototype.options_ = {
	name: 'SelectState'
};

State.registerState('SelectState', SelectState);
export default SelectState;