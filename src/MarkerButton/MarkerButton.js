/**
 * @file marker.js
 */

import videojs from 'video.js';
import Icon from './ButtonIcons';

const Dom = videojs.dom;
const Log = videojs.log;
const Component = videojs.getComponent('Component');
const Button = videojs.getComponent('Button');

class MarkerButton extends Button {
  constructor(player, options) {
    super(player, options);
    
		// store instances of icons
		this.icons = {};
		
		this.currentIcon = null;
		
		this.nextIcon = {};
		
		// the element that changes state
		this.target = this.getElement('Board');
		
		let initialOrder = [];
		
		for (let icon in Icon.getIcons()) {
			this.addIcon(icon, Icon.getIcon(icon));
			initialOrder.push(icon);
		}
		
		if (!options.order) {
			this.setIconOrder(initialOrder);
			let firstIcon = Object.keys(this.icons)[0];
			this.setDefaultIcon(firstIcon);
		} else {
			this.setIconOrder(options.order);
			this.setDefaultIcon(options.order[0]);
		}
		
		this.controlText(this.currentIcon.name().replace(/([A-Z])/g, ' $1'));
  }
  
  /**
   * Creates a wrapper element for changing icons
   * 
   * @method createChild
   */
  createEl() {
		// Button creates the container el with classnames taken from buildCSSClass
    const el = super.createEl();
    
		// Where the icon will go
		this.contentEl_ = Dom.createEl('i');
    el.appendChild(this.contentEl_);
		
    return el;
  }
	
	/**
   * Toggles Board
   *
   * @method handleClick
   */ 
  handleClick() {
    this.goToNextIcon();
		this.target.goToNextState();
  }

  /**
   * Updates ARIA accessibility attributes
   *
   * @method updateARIAAttributes
   */
  updateARIAAttributes() {
    // Current playback rate
    this.el().setAttribute('aria-valuenow', this.player().playbackRate());
  }
	
	/**
	 * Adds an icon for a state
	 *
	 * @param {Object=} options The options for DOM node
	 * @method addIcon
	 */
	addIcon(name, IconClass, options) {
		// Creates new icon and add element as child element to this
		if (!Icon.isPrototypeOf(IconClass)) {
			return;
		}
		
		if (!options) {
			options = {};
		}
				
		let icon = new IconClass(options);
		
		this.icons[name] = icon;
	}
	
	/**
	 * Changes the content of the button
	 *
	 * @param {String} name 
	 */
	changeContent(name) {
		if (this.icons[name]) {
			let icon = this.icons[name];
			
			this.el().removeChild(this.contentEl());
			
			this.contentEl_ = icon.el();
			this.el().appendChild(this.contentEl_);
		}
		
		return this.contentEl_;
	}
	
	/**
	 * Converts an array describing state order to the private order data structure
	 * 
	 * @param {Array} order Ordered array
	 * @method setIconOrder
	 */
	setIconOrder(order) {
		if (!this.nextIcon) {
			this.nextIcon = {};
		}  
		
		let orderLen = order.length;
		for (let i = 0; i < orderLen; i++) {
			let icon = order[i]
			let next = order[(i+1) % orderLen];
			
			if (!this.icons[icon]){
				Log.error("The following state is not registered with the States class: ", icon);
			}
			
			this.nextIcon[icon] = next;
		}

		this.syncStateOrder(order);
	}
	
	/**
	 * Sets the state order from current icon order
	 * 
	 * @param {Array} order Ordered array
	 * @method setStateOrder
	 */
	syncStateOrder(order) {
		if (!this.target) {
			return;
		}
		
		let stateOrder = [];
		let orderLen = order.length;
		for (let i = 0; i < orderLen; i++) {
			let icon = order[i];
			let state = this.icons[icon].getState();
			stateOrder.push(state);
		}
		
		this.target.setStateOrder(stateOrder);
		this.target.setDefaultState(stateOrder[0]);
		this.target.bindEvents();
	}
	
	/**
	 * Sets the default state and swaps 
	 * 
	 * @param {String=} name Name of state
	 * @method setDefaultState
	 */
	setDefaultIcon(name) {
		if (!this.icons) {
			return;
		}
		
		this.currentIcon = this.icons[name] || {};

		if (!this.currentIcon) {
			Log.error(name, ' icon cannot be found.');
			return;
		}
		
		let state = this.currentIcon.getState();
		this.target.setDefaultState(state);
		
		// changes the element
		this.changeContent(name);
		
		return this.currentIcon;
	}
	
	/**
	 * Goes to the next icon
	 *
	 * @method goToNextIcon
	 */
	goToNextIcon() {
		let current = this.currentIcon.name();
		let next = this.nextIcon[current];
		
		this.currentIcon = this.icons[next];
		this.controlText(this.currentIcon.name().replace(/([A-Z])/g, '$1'));

		this.changeContent(next);
		
		return this.currentIcon;
	}
  
  /**
   * Give the element button specific class names
   * 
   * @method buildCSSClass
   */
  buildCSSClass() {
    return 'ntk-marker fa-stack vjs-control';
  }
  
  /**
   * Hide playback rate controls when they're no playback rate options to select
   *
   * @method updateVisibility
   */
  updateVisibility() {
    if (this.playbackRateSupported()) {
      this.removeClass('vjs-hidden');
    } else {
      this.addClass('vjs-hidden');
    }
  }
}

MarkerButton.prototype.options_ = {
	name: 'MarkerButton',
	order: [
		'Normal',
		'Create',
		'Select'
	]
};
MarkerButton.prototype.controlText_ = 'markerButton';

Component.registerComponent('MarkerButton', MarkerButton);
export default MarkerButton;