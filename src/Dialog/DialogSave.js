import mergeOptions from '../utils/merge-options.js';
import {Component, Button} from '../utils/vjs-classes.js';

import Config from '../../config.js';

class DialogSave extends Button {
	constructor(player, options) {
		options = mergeOptions(DialogSave.prototype.options_, options);
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

DialogSave.prototype.options_ = Config.DialogSave;

Component.registerComponent('DialogSave', DialogSave);
export default DialogSave;