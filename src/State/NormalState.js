/**
 * @file normal-state.js
 */
import State from './State.js';

/**
 * Serves as an adapte the marker button triggers to the marker modes
 * 
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class MarkerBoard
 */
class NormalState extends State {
	constructor(context, options){
		super(context, options);
	}
	
	/**
	 * 
	 *
	 * @method bindState
	 */
	bindState() {
		this.context_.addClass('ntk-normal-state');
	}
	
	/**
	 * Disposes state properties 
	 *
	 * @method disposeState
	 */
	disposeState() {
		this.context_.removeClass('ntk-normal-state');
	}
}

NormalState.prototype.options_ = {
	name: 'NormalState'
};

State.registerState('NormalState', NormalState);
export default NormalState;