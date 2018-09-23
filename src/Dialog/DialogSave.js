
import videojs from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

class DialogSave extends Button {
	constructor(player, options) {
		super(player, options);
		
		this.controlText(this.localize('Save'));
	}
	
	createEl() {
		const props = {
			className: 'ntk-dialog-save fa fa-floppy-o'
		}
		
		const attrs = {
			type: 'submit'
		}
		
		const el = super.createEl('button', props, attrs);
		
		return el;
	}
}

DialogSave.prototype.options_ = {
	name: 'DialogSave'
};

Component.registerComponent('DialogSave', DialogSave);
export default DialogSave;