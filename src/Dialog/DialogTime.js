import * as Dom from '../utils/dom.js';
import mergeOptions from '../utils/merge-options.js';
import {Component} from '../utils/vjs-classes.js';
import {assign} from '../utils/obj.js';

import Config from '../../config.js';

import DialogTimeStart from './dialog-time-start.js';
import DialogTimeEnd from './dialog-time-end.js';

class DialogTime extends Component {
	constructor(player, options) {
		options = mergeOptions(DialogTime.prototype.options_, options);
		super(player, options);
	}
	
	createEl(tag = 'div', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog-time'
		}, props);
		
		const el = super.createEl(tag, props, attrs);
		
		const start = new DialogTimeStart(this.player_);
		const end = new DialogTimeEnd(this.player_);
		
		const textEl = Dom.createEl('span', {
			className: 'ntk-dialog-time-text'
		});
		
		textEl.textContent = ' - '
		
		el.appendChild(start.createEl());
		el.appendChild(textEl);
		el.appendChild(end.createEl());
		
		return el;
	}
}

DialogTime.prototype.options_ = Config.DialogTime;

Component.registerComponent('DialogTime', DialogTime);
export default DialogTime;