/**
 * @file select-icon.js
 */
import Icon from './Icon.js';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {faHandPointer} from '@fortawesome/free-regular-svg-icons';

library.add(faHandPointer)

class SelectIcon extends Icon { 
	constructor(options) {
		super(options);
	}
	
	/**
   * Create the Icon's DOM element
   *
   * @param {string} Element's node type
   * @param {Object} props Element properties
   * @param {Object} attrs Element attributes
   * @return {Element} The element that gets created
	 * @method createEl
   */
	createEl(tag = 'i', props = {}, attrs = {}){
		const handpointer = icon(icon({
			prefix: 'far', 
			iconName: 'hand-pointer'
		}), {
			classes: ['fa-lg']
		});
		return handpointer.node[0];
	}
}

SelectIcon.prototype.options_ = {
	name: 'SelectIcon',
	state: 'SelectState'
};

Icon.registerIcon('SelectIcon', SelectIcon);
export default SelectIcon;