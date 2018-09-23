import videojs from 'video.js';
import { assign } from '../utils.js';
import DialogTimeStart from './DialogTimeStart.js';
import DialogTimeEnd from './DialogTimeEnd.js';

const Component = videojs.getComponent('Component');

class DialogTime extends Component {
	constructor(player, options) {
		super(player, options);
	}
	
	createEl(tag = 'div', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog-time'
		}, props);
		
		const el = super.createEl(tag, props, attrs);
		
		const start = new DialogTimeStart(this.player_);
		const end = new DialogTimeEnd(this.player_);
		
		const textEl = super.createEl('span', {
			className: 'ntk-dialog-time-text'
		});
		
		textEl.textContent = ' - '
		
		el.appendChild(start.createEl());
		el.appendChild(textEl);
		el.appendChild(end.createEl());
		
		return el;
	}
}

DialogTime.prototype.options_ = {
	name: 'DialogTime'
};

Component.registerComponent('DialogTime', DialogTime);
export default DialogTime;