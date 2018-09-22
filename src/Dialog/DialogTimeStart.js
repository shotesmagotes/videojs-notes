import mergeOptions from '../utils/merge-options.js';
import {Component} from '../utils/vjs-classes.js';

import Config from '../../config.js';

class DialogTimeStart extends Component {
	constructor(player, options) {
		options = mergeOptions(DialogTimeStart.prototype.options_, options);
		super(player, options);
	}
	
	createEl() {
		const tag = 'input';
		
		const props = {
			className: 'ntk-dialog-start-time'
		};
		
		const attrs = {
			type: 'text',
			name: 'StartTime'
		};
		
		const el = super.createEl(tag, props, attrs);
		
		return el;
	}
}

DialogTimeStart.prototype.options_ = Config.DialogTimeStart;

Component.registerComponent('DialogTimeStart', DialogTimeStart);
export default DialogTimeStart;