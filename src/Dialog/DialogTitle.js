import { assign } from '../utils.js';
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class DialogTitle extends Component {
	constructor(player, options) {
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

DialogTitle.prototype.options_ = {
	name: 'DialogTitle'
};

Component.registerComponent('DialogTitle', DialogTitle);
export default DialogTitle;