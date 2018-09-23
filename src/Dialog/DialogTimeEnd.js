import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class DialogTimeEnd extends Component {
	constructor(player, options) {
		super(player, options);
	}
	
	createEl() {
		const tag = 'input';
		
		const props = {
			className: 'ntk-dialog-end-time'
		};
		
		const attrs = {
			type: 'text',
			name: 'EndTime'
		};
		
		const el = super.createEl(tag, props, attrs);
		return el;
	}
}

DialogTimeEnd.prototype.options_ = {
	name: 'DialogTimeEnd'
};

Component.registerComponent('DialogTimeEnd', DialogTimeEnd);
export default DialogTimeEnd;