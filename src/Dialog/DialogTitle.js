import mergeOptions from '../utils/merge-options.js';
import {Component} from '../utils/vjs-classes.js';
import {assign} from '../utils/obj.js';

import Config from '../../config.js';

class DialogTitle extends Component {
	constructor(player, options) {
		options = mergeOptions(DialogTitle.prototype.options_, options);
		super(player, options);
	}
	
	createEl(tag = 'input', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog-title'
		}, props);
		
		attrs = assign({
			placeholder: 'Title',
			type: 'text',
			name: 'Title'
		}, attrs);
		
		const el = super.createEl(tag, props, attrs);
		
		// We cannot add this to the tech_ object so this will have to do for now..
		return el;
	}
}

DialogTitle.prototype.options_ = Config.DialogTitle;

Component.registerComponent('DialogTitle', DialogTitle);
export default DialogTitle;