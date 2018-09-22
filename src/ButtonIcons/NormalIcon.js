/**
 * @file select-icon.js
 */

import mergeOptions from '../utils/merge-options.js';
import Icon from './Icon.js';

class NormalIcon extends Icon { 
	constructor(options) {
	 	options = mergeOptions(NormalIcon.prototype.options, options);
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
		return super.createEl(
			tag,
			{
				className: 'ntk-marker-mode-icon fa fa-sticky-note-o',
			},
			attrs
		)
	}
}

NormalIcon.prototype.options = {
	name: 'NormalIcon'
};

Icon.registerIcon('NormalIcon', NormalIcon);
export default NormalIcon;