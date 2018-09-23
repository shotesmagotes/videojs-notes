import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class DialogTimeStart extends Component {
	constructor(player, options) {
		super(player, options);
	}
	
	createEl() {
		const tag = 'input';
		
		const props = {
			className: 'ntk-dialog-start-time'
		};
		
		const attrs = {
			type: 'text',
			name: 'StartTime'
		};
		
		const el = super.createEl(tag, props, attrs);
		
		return el;
	}
}

DialogTimeStart.prototype.options_ = {
	name: 'DialogTimeStart'
};

Component.registerComponent('DialogTimeStart', DialogTimeStart);
export default DialogTimeStart;