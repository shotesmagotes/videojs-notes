import mergeOptions from '../utils/merge-options.js';
import {Component, Button} from '../utils/vjs-classes.js';

import Config from '../../config.js';

class DialogDelete extends Button {
	constructor(player, options) {
		options = mergeOptions(DialogDelete.prototype.options_, options);
		super(player, options);
		
		this.controlText(this.localize('Delete'));
	}
	
	buildCSSClass() {
		return 'ntk-dialog-delete fa fa-trash-o';
	}
}

DialogDelete.prototype.options_ = Config.DialogDelete;

Component.registerComponent('DialogDelete', DialogDelete);
export default DialogDelete;