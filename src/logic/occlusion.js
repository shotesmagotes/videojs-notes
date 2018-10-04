/** 
 * DESCRIPTION:
 * This module implements the rule that allows for hover over selection 
 * of occluded items in the scroll bar. This occlusion rule works by hi
 * ghlighting the item with the edge that is closest to the current mou
 * se position. The actual change in item property should be the z-inde
 * x. This logic should be triggered whenever an item's right or left e
 * dge is hovered over. This does not necessarily occur at a mouse over
 *  or mouse out event. 
 *
 * USAGE:
 * 1. Requires a dictionary of DOM elements that correspond to the item
 * s that require occlusion to be handled. The object's z-index will be 
 * changed so the parent element will need to be an absolute element wi
 * th a z-index that is less than the z-index of any of its child eleme
 * nts.
 * 2. Requires that the update function is called on a mouse move event 
 * handler. The calling function should set an interval with this funct
 * ion in order to avoid performance problems.												 
 *																																		 
 * METHOD:												
 * Suppose RESOLUTION = 22, and DEFAULT = 1.
 * We divide the scroll bar into 22 time bins as shown below:					 
 * [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]					 
 * 																																		 
 * Suppose we have a scroll bar that looks like the following,				 
 * [    |\\\\\|xxxxxxx|//////////////|     |////////|      ]	
 * The '\' marks the first item (1), the '/' marks the second item (2),
 * and third items (3), which are separated by blank spaces. The 'x' ma
 * rks the area where the items (1) and (2) overlap.
 * The above scroll bar depiction produces the following array of edges
 * with the edges marked with the item id that it corresponds to:										 
 * [ , ,1, , ,2, , , ,1,  ,  ,  ,  , 2,  , 3,  ,  , 3,  ,  ]
 * The above array is called the _edges array.
 * 																																		 
 * Then, we construct the midpoints array to indicate which time bins a
 * re closest to which edge (marked again by the item's id).
 * [ , ,1, ,2, ,2, , ,1,  ,  , 2,  , 2, 3, 3,  , 3, 3,  ,  ]
 * The above array is called the _midpoints array.
 *
 * Using the midpoints array, we construct the _closest array to have a
 * quick reference for which time bins activates which item.
 * [ , ,1,1,2,2,2,1,1,1, 1, 1, 2, 2, 2, 3, 3,  , 3, 3,  ,  ]
 *
 * In this scenario, the following private variables are set to the fol
 * lowing objects:
 * _zindex: 							{ '1': 2, '2': 1, '3': 1 }
 * _widths: 							{ '1': 7, '2': 9, '3': 3 }
 * 
 * Suppose the user scrolls from item 2's right edge towards item 1's r
 * ight edge. We would have a scenario similar to the one depicted belo
 * w:
 * [    |\\\\\|xxxxxxx|///<-------///|     |////////|      ]
 * We would be hovering over item 2 and so our _currentItem variable wo
 * uld be set to the id 2. Suppose we reach time bin 10, which if we lo
 * okup in the _closest array it would have the value 1. We take the id
 * 1, lookup its z-index in _zindex and if it's z-index is greater than 
 * the z-index of 2, then we do not need to do anything - this is the c
 * ase initially. Suppose that for some reason the z-index of 1 was sma
 * ller than that of item 2. Then, we change the z-index of item 1 to a
 * z-index that is greater than that of item 2. We choose to use z-inde
 * x of 1 greater than that of the currently hovered over item (item 2)
 * This brings the soon to be hovered over item to come forward and act
 * ually trigger an onmouseover event and allow the user to click on it
 *
 * In our case, we did not have any other items overlayed except for it
 * ems 1 and 2. If we did have another item that was occluded by item 1
 * and item 2, then changing the z-index of item 1 could have caused it
 * em 1 to occlude item 3, which may have posed as a problem. In any ca
 * se, the only change in the z-index ordering we want to make is for t
 * he item that is soon to be interacted with. Therefore, we set the z-
 * index that is manually changed by this code, to be an odd number tha
 * t is 1 greater than that of the currently hovered item's original z-
 * index. All other items will have an even number z-index.  
 *
 * 
 **/

import videojs from 'video.js';

const log = videojs.log;

// Arrays binning time as index
let _midpoints = [];
let _edges = [];
let _closest = [];

// Objects containing item info
let _widths = {};
let _zindex = {};

let _itemIds = 0;
let _currentItem = null;
let _previousItem = null;

const DEFAULT = 1;
const RESOLUTION = 101;
const ZINDEX = "zIndex";

let _resolution = RESOLUTION;
let _defaultZ = DEFAULT;

/**
 * Any initialization steps before using this module
 * 
 * @param {Object} options The options for the module
 * @method init
 */
export function init(options) {
	_resolution = options.resolution || RESOLUTION;
	_defaultZ = options.defaultz || DEFAULT;
}

/**
 * Sets the current item for update function
 * Should be called from the onmouseover event
 *
 * @param {Number|String=} id The id property of the item 
 * @method setCurrent
 */
export function setCurrent(id) {
	if(id) 
		log.warn('id not found for setting current item ', id);
	
	_currentItem = id;
}

/**
 * Updates the z-index of the items based on current mouse position
 * Call this every mouse move
 *
 * @param {Decimal} position Mouse pos in percent of parent el
 * @method update
 */
export function update(position) {
	if (!typeof position === "number"){
		return;
	}
	
	let key = Math.floor(position * 1e2);
	
	// 22.5 pixels / ms
	if (_closest[key]) {
		// grab the id of the closest edge and then change the z-index here
		let id = _closest[key];
		
		// default the previously hovered item's z-index
		if (_currentItem != _previousItem && id == _currentItem) {
			defaultZIndex(_previousItem);
			_previousItem = _currentItem;
		}; 
	
		// bring the neighbor's z-index above current's
		activateNeighbor(id);
	}
	// if there is none then there's nothing to do...
}

/**
 * Adds an item and sets it up for occlusion 
 * Call this to add mark item
 *
 * @param {Object} item Includes the edge, id and z-index info
 * @method add
 */
export function add(item) {
	if (!item)
		return;
	
	if (!item.edges) 
		log.error('right edge not found in item ', item);
	if (!item.id) 
		log.error('id not found in item ', item);
	if (!item.style) 
		log.error('style reference not found in item ', item);
	
	const leftEdge = item.edges.left;
	const rightEdge = item.edges.right;
	const id = item.id;
	
	let idsInWidthOrder;
	
	// setting _zindex must come before _widths
	_zindex[id].default = 0;
	_zindex[id].reference = item.style;
	
	_widths[id] = rightEdge - leftEdge;
	// order for assigning initial z-index values
	idsInWidthOrder = Objects.keys(_widths).sort(function(a, b) { 
		return _widths[a] - _widths[b] 
	});
	
	// creating midpoint must come before inserting new edge
	for (edge in item.edges) {
		createMidpoint(item.edges[edge], id);
		insertEdge(item.edges[edge], id);
	}
	
	assignInitialZIndexByWidth(idsInWidthOrder);
}

/**
 * Removes an item from the globals
 *
 * @param {Object}
 * @method remove
 */
export function remove(item) {
	// deleting an item
	return item;
}

/**
 * Brings the z-index of currently focused item above its neighbor's
 * 
 * @param {String} neighbor ID of the item
 * @method activateNeighbor
 */
function activateNeighbor(neighbor) {
	if (_currentItem == neighbor) 
		return;
	
	let zneighbor = getZIndex(neighbor);
	let zcurrent = getZIndex(_currentItem);
	
	if (zneighbor > zcurrent)
		return;
	else {
		setZIndex(neighbor, zcurrent + 1);
	}
}

/**
 * Gets the z-index / reference to CSSStyle of item
 * 
 * @param {String} id ID of the item
 * @param {String} type Type of description you would like to retrieve
 * @param {Number} 
 * @method getZIndex
 */
function getZIndex(id, type) {
	if (!type) {
		type = 'default';
	}
	
	if (type === 'default') 
		return _zindex[id].default;
	else if (type === 'reference')
		return _zindex[id].reference[ZINDEX];
}

/**
 * Sets the z-index of an item either to the default property or to the actual
 * CSS reference value
 *
 * @param {String} id ID of the item
 * @param {String} val Value of the zindex
 * @param {String} type Setting type
 * @method setZIndex
 */
function setZIndex(id, val, type) {
	if (!type) {
		type = 'reference';
	}
	
	if (type === 'default') 
		_zindex[id].default = val;
	else if (type === 'reference')
		_zindex[id].reference[ZINDEX] = val;
}

/**
 * Sets the default zindex of the item
 * 
 * @param {String} id ID of the item
 * @method defaultZIndex
 */
function defaultZIndex(id) {
	if (!_zindex[id].default) {
		log.error('no default z-index set for id ', id);
	}
	
	setZIndex(id, _zindex[id].default, 'default');
}

/**
 * Assigns the initial zindex for all items
 * 
 * @param {Array} idsInWidthOrder Sorted ids by increasing widths
 * @method assignInitialZIndexByWidth
 */
function assignInitialZIndexByWidth(idsInWidthOrder) {
	let start = DEFAULT;
	
	for (id in idsInWidthOrder) {
		setZIndex(id, start * 2);
		start++;
	}
}

/**
 * Inserts an edge in the time indexed array
 *
 * @param {Decimal} edge Time value in percent of parent el
 * @param {String} id ID of the item
 * @method insertEdge
 */
function insertEdge(edge, id) {
	if (!_edges[edge]) {
		_edges[edge].push(id);
	} else {
		_edges[edge] = [id];
	}
}
	
/**
 * Gets the midpoint between item edges and surrounding item edges
 *
 * @param {Number} edge The time point at which an edge occurs
 * @param {String} id ID of the item
 * @method createMidpoint
 */
function createMidpoint(edge, id) {
	let boundaries = {
		'left': 0,
		'right': 0
	};
	
	let leftOfEdge = edge;
	let rightOfEdge = edge;
	
	leftOfEdge = findNextEdge(edge, -1);
	rightOfEdge = findNextEdge(edge, 1);
	
	[leftOfEdge, rightOfEdge].forEach(function(bound) {
		let point;
		
		if (bound < 0) {
			point = edge;
		} else { // skip evaluation if not an edge
			point = calculateMidpoint(bound, edge);
			if (point == bound) {
				point = edge;
			}

			if (Math.round(point) != point) {
				point = (bound < edge) ? Math.ceil(point): Math.floor(point);
			} else {
				// if the current midpoint is an integral number, then there were 
				// odd number of spaces in between edge and adjacent edge
				// we decide who gets priority by smaller width of time interval
				if (_widths[_edges[bound]] < _widths[id]) {
					point = (bound < edge) ? point + 1 : point - 1;
				}
			}
		}
		
		insertMidpoint(point, id);
		if (bound == leftOfEdge) boundaries.left = point;
		if (bound == rightOfEdge) boundaries.right = point;
	});
	
	insertClosest(boundaries.left, boundaries.right, id);
}

/** 
 * Calculates the midpoint between edges
 * 
 * @param {Number} right Right end of interval
 * @param {Number} left Left end of interval
 * @return {Number}
 * @method calculateMidpoint
 */
function calculateMidpoint(right, left) {
	if ((left && right) || typeof left !== 'number' || typeof right !== 'number')
		log.error('need two indices as arguments for calculateMidpoint');
	if (left == right) return left; // for cases where 2 edges coincide
	
	// will always resolve to the left edge
	return (right + left) / 2; 
}

/**
 * Inserts id into midpoint array with priority given to 
 * shorter intervals
 * 
 * @param {Number} time Time point at which you would like to enter midpoint
 * @param {String} id ID of item
 * @method insertMidpoint
 */
function insertMidpoint(time, id) {
	if (_midpoints[time]) {
		let presentMidpointWidth = _widths[_midpoints[time]];
		if (_widths[id] < presentMidpointWidth) {
			_midpoints[time] = id;
		}
	} else {
		_midpoints[time] = id;
	} 
}

/**
 * Sets up closest array denoting the element ids that are closest 
 * to a given time point
 *
 * @param {Number} left Left point
 * @param {Number} right RIght point
 * @param {String} id ID of item that is going to be copied into closest
 * @method insertClosest
 */
function insertClosest(left, right, id) {
	if (left > right) {
		log.warn('illegal boundaries for id ', id);
		let temp = left;
		left = right;
		right = temp;
	}
	
	while(left <= right) {
		_closest[left] = id;
		left++;
	}
}

/**
 * Finds the edge that is left or right to the given time point
 * 
 * @param {Number} time Time point that you would like to find closest edge to
 * @param {-1, 1} direction -1 = to the left, 1 = to the right
 * @return {Number}
 * @method findNextEdge
 */
function findNextEdge(time, direction) {
	let updateIndex;
	
	if (direction > 0) { 
		updateIndex = (index) => {
			index + 1;
			return (index < RESOLUTION);
		}
	} else if (direction < 0) {
		updateIndex = (index) => {
			index - 1;
			return (index >= 0);
		}
	}
	
	do {
		if (_edges[time]) {	
			break;
		}
		delete _midpoints[time];
	} while (updateIndex(time));
	
	// if index reaches index 0 or RESOLUTION - 1 and doesn't detect an edge
	// return a falsey value
	if (!_edges[time]) return -1; 
	
	return time;
}

