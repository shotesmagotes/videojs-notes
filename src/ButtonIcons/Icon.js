import videojs from 'video.js';
import { toTitleCase } from '../utils.js';

const mergeOptions = videojs.mergeOptions;
const Dom = videojs.dom;
const Log = videojs.log;

class Icon {
	constructor(options) {	
		this.options_ = mergeOptions({}, this.options_);
		options = this.options_ = mergeOptions(this.options_, options);
		
		if (options.el) {
      this.el_ = options.el;
    } else if (options.createEl !== false) {
      this.el_ = this.createEl();
    }
		
		if (options.name) {
			this.name_ = options.name;
		}
		
		if (options.state) {
			this.state_ = options.state;
		} else {
			Log.warn('No state is specified for icon ', this.name());
		}
	}
	
	/**
   * Create the `Component`s DOM element.
   *
   * @param {String} tagName Element's DOM node type. e.g. 'div'
   * @param {Object} properties An object of properties that should be set.
   * @param {Object} attributes An object of attributes that should be set.
   * @return {Element}
	 * @method createEl
   */
  createEl(tagName, properties, attributes) {
    return Dom.createEl(tagName, properties, attributes);
  }
	
	/**
	 * Returns the name of the state
	 * 
	 * @return {String}
	 * @method name
	 */
	name() {
		return this.name_;
	}
	
	/**
	  * Returns the icon element
		* 
		* @return {Element}
		* @method el
	  */
	el() {
		return this.el_;
	}
	
	/**
	 * Returns the state associated with the icon
	 *
	 * @return {String}
	 * @method state
	 */
	getState() {
		return this.state_;
	}
	
	/**
	 * Adds a state to the private states object
	 * 
	 * @param {String} name Name of the state
	 * @param {Class} state State class
	 * @return {Object}
	 * @method registerState
	 */
	static registerIcon(name, icon) {
		if (!name) {
      return;
    }

    name = toTitleCase(name);

    if (!Icon.icons_) {
      Icon.icons_ = {};
    }
		
    Icon.icons_[name] = icon;

    return icon;
	}
	
	/**
	 * Returns a specific state class
	 *
	 * @return {Object}
	 * @method getStates
	 */
	static getIcon(name) {
		if (!name && !Icon.icons_) {
			return;
		}
		
		name = toTitleCase(name);
		
		if (Icon.icons_[name]) {
			return Icon.icons_[name];	
		} else {
			Log.Error('Cannot find state in registered states: ', name);
		}
	}
	
	/**
	 * Returns the states_ object
	 *
	 * @return {Object}
	 * @method getStates
	 */
	static getIcons() {
		return Icon.icons_;	
	}
}

export default Icon;