/**
 * @file create-icon.js
 */

import Icon from './Icon.js';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {faEdit} from '@fortawesome/free-regular-svg-icons';

library.add(faEdit)

class CreateIcon extends Icon { 
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
		const edit = icon(icon({
			prefix: 'far', 
			iconName: 'edit'
		}), {
			classes: 'fa-lg'
		});
		
		return edit.node[0]
	}
}

CreateIcon.prototype.options_ = {
	name: 'CreateIcon',
	state: 'CreateState'
};

Icon.registerIcon('CreateIcon', CreateIcon);
export default CreateIcon; 