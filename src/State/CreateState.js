/**
 * @file create-state.js
 */

import * as Logic from '../../logic/occlusion.js'
import State from './State.js';
import '../Dialog.js';

const bind = videojs.bind;
/**
 * Handles events for creating marks
 * 
 * @param {Player|Object} player
 * @param {Object=} options
 * @class CreateState
 */
class CreateState extends State {
	constructor(context, options) {
		super(context, options);
		
		this.handleTechClick = bind(this, this.handleTechClick);
		this.handleDialogFormSubmit = bind(this, this.handleDialogFormSubmit);
		
		this.anchor_ = 0;
		this.mark_ = null;
		this.currentDialog_ = null;
	}
	
	/**
	 * Binds the events to the context 
	 * 		called on state changes
	 * 
	 * @method bindEvents
	 */
	bindState() {
		this.context_.addClass('ntk-create-state');

		const context = this.context_;
		const target = context.contentEl();
		
		// bind events to the ntk board el
		context.on(target, 'click', bind(this, this.handleClick));
		context.on(target, 'mousedown', bind(this, this.handleMouseDown));
    context.on(target, 'touchstart', bind(this, this.handleMouseDown));
	}
	
	/**
	 * Disposes of state properties
	 *
	 * @method dispose
	 */
	disposeState() {
		const context = this.context_;
		const target = context.contentEl();
		
		// remove any active mark
		if (this.mark_) {
			context.removeMark(this.mark_.id());
			context.player().tech_.off('click', this.handleTechClick);	
		}
		
		// allow garbage collector to collect these items
		this.mark_ = null;
		this.anchor_ = null;
		
		// dispose attached events to board
		context.off(target, 'click', bind(this, this.handleClick));
		context.off(target, 'mousedown', bind(this, this.handleMouseDown));
    context.off(target, 'touchstart', bind(this, this.handleMouseDown));
		
		this.context_.removeClass('ntk-create-state');
	}
	
  /**
	 * Stops propogation of marks element click event to parent elements
	 *
	 * @param {Event} event
	 * @method handleClick
	 */
	handleClick(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	
	/**
   * Initiates creation of a new mark item
   * 
   * @param {Event} event
   * @method handleMouseDown
   */
  handleMouseDown(event) {	
		const context = this.context_;
			
    event.preventDefault();
		
		// get the distance of where the anchor should be
		this.anchor_ = context.calculateDistance(event);
		
		// removes if already present
		if (this.mark_) {
			context.removeMark(mark.id());
		}
		
		this.mark_ = context.addMark();
		this.mark_.addClass('ntk-mark-selected');
		
		super.handleMouseDown(event);
  }
  
  /**
   * Draws the highlighted segment by calling Marks API
   *
   * @param {Event} event
   * @method handleMouseMove
   */
  handleMouseMove(event){				
		// gets the first time point user selected with mousedown event
		const anchor = this.anchor_;
		
		// calculates the position of mouse in percent of scroll bar
		let progress = this.context_.calculateDistance(event);
		
		// updates the left or right depending on which direction
		// the user is updating the mark item
		if (progress < anchor) {
			this.mark_.setElPosition({
				left: progress,
				right: anchor
			});
		} else if (progress >= anchor) {
			this.mark_.setElPosition({
				left: anchor,
				right: progress
			});
		}
  }
  
  /**
   * Triggers the mark end event for the active mark
   *
   * @param {Object} event Event object
   * @method handleMouseUp
   */
  handleMouseUp(event) {
		const context = this.context_;
				
		// create dialog on finish
		let dialog = context.openMark(this.mark_.id());
		context.player().tech_.on('click', this.handleTechClick);
		dialog.getForm().on('submit', this.handleDialogFormSubmit);
		
		super.handleMouseUp(event);
	}
	
	/**
	 * Handles clicks on the tech
	 *
	 * @method handleTechClick
	 */
	handleTechClick(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		
		const context = this.context_;
		
		context.removeMark(this.mark_.id());
		context.player().tech_.off('click', this.handleTechClick);

		this.mark_ = null;
		this.anchor_ = null;
	}
	
	/**
	 * Handles dialog form submit
	 *
	 * @method handleDialogFormSubmit
	 */
	handleDialogFormSubmit(event) {
		event.preventDefault();
		
		const id = this.mark_.id();
		
		let edges = mark.getPosition();
		
		for (edge in edges) {
			edges[edge] = Math.floor(edges * 100);
		}
		
		const styleRef = mark.el_.style;
		
		Logic.add({
			id: id,
			edges: edges,
			style: styleRef
		});
		
		this.mark_.removeClass('ntk-mark-selected');
		
		this.anchor_ = null;
		this.mark_ = null;
	}
}

CreateState.prototype.options_ = {
	name: 'CreateState'
};

State.registerState('CreateState', CreateState);
export default CreateState;