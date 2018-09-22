import mergeOptions from '../utils/merge-options.js';
import {Component} from '../utils/vjs-classes.js';

import Config from '../../config.js';

class DialogTimeEnd extends Component {
	constructor(player, options) {
		options = mergeOptions(DialogTimeEnd.prototype.options_, options);
		super(player, options);
	}
	
	createEl() {
		const tag = 'input';
		
		const props = {
			className: 'ntk-dialog-end-time'
		};
		
		const attrs = {
			type: 'text',
			name: 'EndTime'
		};
		
		const el = super.createEl(tag, props, attrs);
		return el;
	}
}

DialogTimeEnd.prototype.options_ = Config.DialogTimeEnd;

Component.registerComponent('DialogTimeEnd', DialogTimeEnd);
export default DialogTimeEnd;