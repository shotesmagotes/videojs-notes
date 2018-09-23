import videojs from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

class DialogDelete extends Button {
	constructor(player, options) {
		super(player, options);
		
		this.controlText(this.localize('Delete'));
	}
	
	buildCSSClass() {
		return 'ntk-dialog-delete fa fa-trash-o';
	}
}

DialogDelete.prototype.options_ = {
	name: 'DialogDelete'
};

Component.registerComponent('DialogDelete', DialogDelete);
export default DialogDelete;