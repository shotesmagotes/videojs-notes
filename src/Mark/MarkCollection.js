/**
 * Mark Collection component
 * 		UI object that lays over the slider bar
 * 		to give access to mark item creation.
 * 
 * @file mark-collection.js
 */

import videojs from 'video.js';
import MarkItem from './MarkItem.js';

const mergeOptions = videojs.mergeOptions;
const Log = videojs.log;
const Dom = videojs.dom;
const Component = videojs.getComponent('Component');

/**
 * Controls the CRUD operations for the mark items
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @MarkCollection
 */
class MarkCollection extends Component {
  constructor(player, options) {
		options = mergeOptions(MarkCollection.prototype.options_, options);
    super(player, options);
		
		this.dialog_ = null;
  }
  
  /**
   * Creates the parent element for holding all MarkCollection
	 * 
	 * @return {HTMLElement}
	 * @method createEl
   */
  createEl() {
    const el = super.createEl('div', {
      className: 'ntk-mark-collection'
    });
		
		this.contentEl_ = super.createEl('ul', {
			className: 'ntk-board vjs-progress-holder'
		});
		
		el.appendChild(this.contentEl_);
		
		return el;
  }
	
	/**
	 * Removes all marks from the static marks list
	 * 
	 * @method removeAllMarks
	 */
	removeAllMarks() {
		for (id in MarkCollection.prototype.marks) {
			delete MarkCollection.prototype.marks[id];
		}
		
		MarkCollection.prototype.marks = {};
	}
	
	/**
	 * Returns the marks - all mark items
	 *
	 * @return {Object} mark
	 * @method getAllMarks
	 */
	getAllMarks(){
		return MarkCollection.prototype.marks;	
	}
	
	/**
	 * Gets the mark of mark id
	 * 
	 * @param {String} markID The id of the mark
	 * @returns {MarkItem}
	 * @method getMark
	 */
	getMark(markID) {
		if (MarkCollection.prototype.marks[markID]) {
			return MarkCollection.prototype.marks[markID];
		} else {
			Log.error('missing id encountered');
			return null;
		}
	}
  
	/**
	 * Removes the current mark
	 * 
	 * @param {String} markID The id of the mark
	 * @method removeMark
	 */
 	removeMark(markID) {
		if (!markID) {
			return;
		}
		
		let mark = this.getMark(markID); 
		
		if (mark) {
			this.closeMark(markID);
			mark.dispose();
		}

		MarkCollection.prototype.marks[markID] = null;
  }
	
	/**
	 * Adds a mark to the collection object
	 *
	 * @param {Object} options Options for MarkItem
	 * @return {MarkItem}
	 * @method addMark
	 */
	addMark(options) {
		const mark = new MarkItem(this.player_, options);
		this.addChild(mark);
		
		MarkCollection.prototype.marks[mark.id()] = mark;
		return mark;
	}
  
	/**
	 * Creates a dialog but dialog can exist once
	 *
	 * @param {String} markID The id of the mark
	 * @method openMark
	 */
	openMark(markID) {
		const mark = this.getMark(markID);
		
		if (!this.dialog_) {
			const dialog = new dialog(this, null)
			this.dialog_ = this.player_.addChild('Dialog');
		}
		
		if (this.dialog_.isActive()) {
			this.closeMark(this.dialog_.mark().id());
		}
		
		this.dialog_.loadMark(mark);
		return this.dialog_;
	} 
	
	/**
	 * Closes the dialog and resets active mark
	 *
	 * @param {String} markID The id of the mark
	 * @method closeMark
	 */
	closeMark(markID) {
		const mark = this.getMark(markID);
		
		if (!this.dialog_) {
			Log.warn('Called before instantiating dialog');
			return;
		}
		
		if (this.dialog_.mark().id() === markID) {
			this.dialog_.unloadMark();
		}
	}
	
  /**
   * Gets the mouse position in percentage x y within this element
   *
   * @param {Object} event Event object
   * @method calculateDistance
   */
  calculateDistance(event) {
    const position = Dom.getPointerPosition(this.contentEl(), event);

    if (this.vertical()) {
      return position.y;
    }
    return position.x;
  }
  
  /**
   * Gets the vertical status of slider bars from player's control bar
   * 
   * @method vertical
   */
  vertical() {
    let controlBar = this.player_.getChild('controlBar');
    let progressControl = controlBar.getChild('progressControl');
    let seekBar = progressControl.getChild('seekBar');

    return seekBar.vertical();
	}
	
	/**
	 * Specific dispose function for clearing internal ref
	 *
	 * @method dispose
	 */
	dispose() {
		this.dialog_.dispose();
		this.dialog_ = null;
	}
}

/**
 * Holds the marks elements 
 * Make sure set to null when destroying the mark-collection
 * by including it in the dispose method
 */
MarkCollection.prototype.marks = {};

MarkCollection.prototype.options = {
	name: 'MarkCollection'
};

Component.registerComponent('MarkCollection', MarkCollection);
export default MarkCollection;