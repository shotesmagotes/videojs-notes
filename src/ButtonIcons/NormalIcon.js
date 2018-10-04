/**
 * @file select-icon.js
 */

import Icon from './Icon.js';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {faStickyNote} from '@fortawesome/free-regular-svg-icons';

library.add(faStickyNote)

class NormalIcon extends Icon { 
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
		const stickynote = icon(icon({
			prefix: 'far', 
			iconName: 'sticky-note'
		}), {
			classes: ['fa-lg']
		});
		return stickynote.node[0]
	}
}

NormalIcon.prototype.options_ = {
	name: 'NormalIcon',
	state: 'NormalState'
};

Icon.registerIcon('NormalIcon', NormalIcon);
export default NormalIcon;