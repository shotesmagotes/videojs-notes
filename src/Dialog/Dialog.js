/**
 * @file dialog.js
 */

import * as Dom from '../utils/dom.js';
import mergeOptions from '../utils/merge-options.js';
import * as Fn from '../utils/fn.js';
import Log from '../utils/log.js';
import * as Form from '../utils/form.js';
import {Component} from '../utils/vjs-classes.js';
import {assign} from '../utils/obj.js'
import formatTime from '../utils/format-time.js';

import Config from '../../config.js';

import DialogForm from './DialogForm.js';

class Dialog extends Component {
	constructor(player, options){
		options = mergeOptions(Dialog.prototype.options_, options);
		super(player, options);
		
		this.mark_ = null;
		
		this.form_ = this.getChild('DialogForm');
		
		let formHandler = Fn.bind(this, this.handleFormSubmit);
		this.form_.on('submit', formHandler);
		
		this.on('click', this.handleContainerClick);
		
		// hide initially
		this.hide();
		
		this.setDimension(options.size || null);
	}
	
	/**
	 * Gets if element is shown or hidden
	 *
	 * @return {Boolean} true if active
	 * @method isActive
	 */
	isActive() {
		if (typeof this.active_ !== 'undefined') {
			return this.active_;
		} 
	}
	
	/**
	 * Overrides super method and sets active
	 *
	 * @param {Function} fn Callback for tech click handler
	 * @method show
	 */
	show(fn) {
		this.player().controls_ = false;
		
		super.show();
		this.active_ = true;
	}
	
	/**
	 * Overrides super method and sets inactive
	 *
	 * @method hide
	 */
	hide() {
		this.player().controls_ = true;
		
		super.hide();
		this.active_ = false;
	}
	
	/**
	 * Loads mark into the dialog
	 * 
	 * @param {MarkItem} mark Mark object to be loaded
	 * @method loadMark
	 */
	loadMark(mark) {
		this.mark_ = mark;
		
		// add step for checking if there's data associated 
		// with this mark and add note data here
		
		this.position();
		this.setTimeValues();
		
		if (!this.isActive()) {
			this.show();
		}
	}
	
	/**
	 * Unloads mark from dialog
	 * 
	 * @method unloadMark
	 */
	unloadMark() {
		if (this.mark_) {
			this.mark_ = null;
			
			if (this.isActive()) {
				this.hide();
			}
		}
	}
	
	/**
	 * Returns the mark 
	 *
	 * @return {MarkItem}
	 * @method mark
	 */
	mark() {
		return this.mark_;
	}
	
	/**
	 * Calculates and sets the position of dialog
	 * Call function after inserting dialog into DOM
	 * 
	 * @method setPosition
	 */
	position() {		
		const playerEl = this.player().el();
		const markEl = this.mark().el();

		let boxPlayer = Dom.findElPosition(playerEl);
		let boxMark = Dom.findElPosition(markEl);
		
		const markL = boxMark.left;
		const playerL = boxPlayer.left;
		
		// offsets only work after element
		// has been added into the DOM
		const markW = this.mark().el_.offsetWidth;
		const dialogW = this.width();
		const playerW = this.player().el_.offsetWidth;
		
		let leftPos = markL - playerL + 0.5*(markW - dialogW); 
		let leftMax = playerW - dialogW;
		
		// we do not want dialog to end outside
		// of player
		leftPos = Math.max(0, Math.min(leftMax, leftPos));
		
		this.el_.style['left'] = leftPos + 'px';
		
		this.setTimeValues();
		return leftPos;
	}
	
	/**
	 * Gets all the dialog elements
	 *
	 * @method getAllFormElements
	 */
	getAllFormElements() {
		return this.form_.getInputs();
	}
	
	/**
	 * Gets the form object
	 *
	 * @method getForm
	 */
	getForm() {
		return this.form_;
	}
	
	/**
	 * Sets initial time values
	 *
	 * @method setTimeValues
	 */
	setTimeValues() {
		const duration = this.player_.duration();
		const mark = this.mark_;
		
		if (mark) {
			const markPos = mark.getPosition();
			const startTime = formatTime(markPos.left * duration);
			const endTime = formatTime(markPos.right * duration);
			
			this.setFormData({
				'StartTime': startTime,
				'EndTime': endTime
			});
		} else {
			Log.error('no mark item associated with dialog');
		}
	}
	
	/**
	 * Sets data into respective form elements
	 *
	 * @param {Object} data The data object to set
	 * @method setFormData
	 */
	setFormData(data) {
		const els = this.getAllFormElements();
		
		for (name in data) {
			els[name].value = data[name];
		}
		
	}
		
	/**
	 * Changed name from createEl because Component calls 
	 * createDialog and that is unintended
	 *
	 * @method createEl
	 */
	createEl(tag = 'div', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog'
		}, props);
		
		const el = super.createEl(tag, props, attrs);
		
		return el;
	}
	
	/**
	 * Disposes the dialog
	 *
	 * @method dispose
	 */
	dispose() {
		const formHandler = Fn.bind(this, this.handleFormSubmit);
		this.form_.off('submit', formHandler);
		
		// clears the internal references
		this.mark_ = null;
		this.form_ = null;
		
		this.form_.off();
		
		super.dispose();
	}
	
	/**
	 * Sets the dimensions of the dialog
	 *
	 * @param {Object} size Contains width and height props
	 * @method setDimension
	 */
	setDimension(size){
		let width = size && size.width;
		let height = size && size.height;

		if (!size) {
			size = this.player().notetaking().determinePlayerSize();
			width = size.width * 0.255555;
			height = 0;
		} 
		
		super.dimension('width', width);
		
		if (height) {
			super.dimension('height', height);
		}
	}
	
	/**
	 * Disables the click from propogating to the player
	 *
	 * @param event Event object
	 * @method handleContainerClick
	 */
	handleContainerClick(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	
	/**
	 * Handles dialog form submit
	 *
	 * @param {Event} event
	 * @method handleFormSubmit
	 */
	handleFormSubmit(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		
		const data = Form.formToJson(this.getAllFormElements());
		console.log('submitted');
	}
}

Dialog.prototype.options = {
	name: 'Dialog'
};

Component.registerComponent('Dialog', Dialog);
export default Dialog;