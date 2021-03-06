import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import Board from './Board';
import MarkerButton from './MarkerButton';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEdit, faStickyNote, faHandPointer} from '@fortawesome/free-regular-svg-icons';

library.add(faEdit, faStickyNote, faHandPointer)

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Notes extends Plugin {

  /**
   * Create a Notes plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('vjs-notes');

      const progressControl = this.player.
                  getChild('controlBar').
                  getChild('progressControl')
      
      const board = new Board(this, options)
      progressControl.addChild(board)

      const playerControl = this.player.
                  getChild('controlBar')

      const markerButton = new MarkerButton(this.player, options);
      playerControl.addChild(markerButton);
    });
  }
}

// Define default values for the plugin's `state` object here.
Notes.defaultState = {};

// Include the version number.
Notes.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('notes', Notes);

export default Notes;
