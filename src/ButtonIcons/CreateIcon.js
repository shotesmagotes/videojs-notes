/**
 * @file create-icon.js
 */

import videojs from 'video.js';
import Icon from './Icon.js';

const mergeOptions = videojs.mergeOptions;

class CreateIcon extends Icon { 
	constructor(options) {
		options = mergeOptions(CreateIcon.prototype.options, options);
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
				className: 'ntk-marker-mode-icon fa fa-pencil',
			},
			attrs
		)
	}
}

CreateIcon.prototype.options = {
	name: "CreateIcon"
};

Icon.registerIcon('CreateIcon', CreateIcon);
export default CreateIcon; 