import videojs from 'video.js';
import { assign } from '../utils.js';
import './DialogSave.js';
import './DialogDelete.js';

const Component = videojs.getComponent('Component');

class DialogButtons extends Component {
	constructor(player, options) {
		super(player, options);
	}
	
	createEl(tag = 'div', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog-buttons'
		}, props);
		
		const el = super.createEl(tag, props, attrs);
		
		// We cannot add this to the tech_ object so this will have to do for now..
		return el;
	}
}

DialogButtons.prototype.options_ = {
	name: 'DialogButtons',
	children: [
		'DialogSave',
		'DialogDelete'
	]
};

Component.registerComponent('DialogButtons', DialogButtons);
export default DialogButtons;