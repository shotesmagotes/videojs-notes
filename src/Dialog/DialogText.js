import mergeOptions from '../utils/merge-options.js';
import {Component} from '../utils/vjs-classes.js';
import {assign} from '../utils/obj.js';

import Config from '../../config.js';

class DialogText extends Component {
	constructor(player, options) {
		options = mergeOptions(DialogText.prototype.options_, options);
		super(player, options);
	}
	
	createEl(tag = 'textarea', props = {}, attrs = {}) {
		let rows;
		let size = this.player().notetaking().determinePlayerSize();
		
		
		if (size.width <= 180) {
			rows = 3;
		} else {
			rows = 5;
		}
		
		props = assign({
			className: 'ntk-dialog-text'
		}, props);
		
		attrs = assign({
			placeholder: 'Notes',
			rows: rows,
			name: 'Notes'
		}, attrs);
		const el = super.createEl(tag, props, attrs);
		
		// We cannot add this to the tech_ object so this will have to do for now..
		return el;
	}
}

DialogText.prototype.options_ = Config.DialogText;

Component.registerComponent('DialogText', DialogText);
export default DialogText;