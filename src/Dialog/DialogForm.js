import videojs from 'video.js';
import { assign } from '../utils.js';
import './DialogTitle.js';
import './DialogText.js';
import './DialogTime.js';
import './DialogButtons.js';

const Component = videojs.getComponent('Component');

class DialogForm extends Component {
	constructor(player, options) {
		super(player, options);
	}
	
	createEl(tag = 'form', props = {}, attrs = {}) {
		props = assign({
			className: 'ntk-dialog-form'
		}, props);
		
		attrs = assign({
			autocomplete: 'off',
		}, attrs)
		
		const el = super.createEl(tag, props, attrs);
		
		// We cannot add this to the tech_ object so this will have to do for now..
		return el;
	}
	
	getInputs() {
		return this.el_.elements;
	}
}

DialogForm.prototype.options_ = {
	name: 'DialogForm',
	children: [
		'DialogTime',
		'DialogTitle',
		'DialogText',
		'DialogButtons'
	]
};

Component.registerComponent('DialogForm', DialogForm);
export default DialogForm;