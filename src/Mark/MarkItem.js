/**
 * @file mark-item.js
 */

import * as Guid from 'video.js/utils/guid.js';
import mergeOptions from 'video.js/utils/merge-options.js';
import Log from 'video.js/utils/log.js';
import { Component } from 'video.js';
import {assign} from 'video.js/utils/obj.js';


class MarkItem extends Component {
	constructor(player, options){
		options = mergeOptions(MarkItem.prototype.options_, options);
		super(player, options);
				
		this.position_ = {};
		
		if (!!options.position) {
			this.setElPosition(options.position);
		} else {
			Log.warn('defaulting position of item');
		}
			
		this.id_ = `Item_${Guid.newGUID().toString()}`;
		
		this.on('click', this.handleClick);
		this.on('mouseenter', this.handleHover);
		this.on('mouseleave', this.handleHover);
	}
	
	/**
   * Creates the MarkItem element
	 * 
	 * @return {HTMLElement}
	 * @method createEl
   */
	createEl(tag = 'li', props = {}, attrs = {}) {
		props = assign({
			startPoint: 0,
      className: 'ntk-mark-item'
		}, props);
		
		attrs = assign({
			id: this.id()
		}, attrs);
		
		return super.createEl(tag, props, attrs);
	}
	
	/**
	 * Sets the position of the item
	 *
	 * @param {Object} position 
	 *				ratio of pointer position to parent element width
	 *				where pointer position is taken from left edge of 
	 *				the parent element
	 * @method setPosition
	 */
	setElPosition(position) {
		let percent = {};
		
		for (let side in position) {
			if (typeof position[side] === "number") {
				// add percent sign later
				percent[side] = (position[side] * 100).toFixed(2);
			} 
		}
		
		if (percent.left) {
			let left = percent.left;
			this.el().style.left = left + "%";
			
			this.position_["left"] = position.left;
		}
		
		if (position.right) {
			let right = 100 - percent.right;
			this.el().style.right = right + "%";
			
			this.position_["right"] = position.right;
		}
	}
	
	/**
	 * Get the position of the item
	 *
	 * @return {Object} Position object with left and right values
	 * @method getPosition
	 */
	getPosition() {
		return this.position_;
	}
}

/**
 * Handles click event
 * 
 * @param {Event} event
 * @method handleClick
 */
MarkItem.prototype.handleClick = function(event) {
	this.toggleClass('ntk-mark-selected');
}

/**
 * Handles hover event
 * 
 * @param {Event} event
 * @method handleHover
 */
MarkItem.prototype.handleHover = function(event) {
	this.toggleClass('ntk-mark-focused');
}

MarkItem.prototype.options = {
	name: 'MarkItem'
};

Component.registerComponent('MarkItem', MarkItem);
export default MarkItem;