/**
 * @author		Gabriel Ivanica
 * @contact		gabriel.ivanica@gmal.com
 * @webpage		www.developertek.com
 */


/**
 * Object for generating a game  
 */

var Puzzle = {
	puzzle : null,
	
	// Puzzle dimensions
	width: null,
	height: null,
	mask_size: null,
	
	// Number of Mask blocks (X, Y)
	
	max_X: null,
	max_Y: null,
	
	// Direction
	
	dir : function (id, x, y) {
		var C = id.split('M');
		return 'M' + (parseInt(C[1]) + x) + 'M' + (parseInt(C[2]) + y);
	},
	
	getMaskNumber : function () {
		this.max_X = this.width / this.mask_size;		
		this.max_Y = this.height / this.mask_size;	
	},
	
	construct : function (width, height, mask_size) {
		this.width = width;
		this.height = height;
		this.mask_size = mask_size;
		this.getMaskNumber();
		this.generateMask();
	},

	newMask : function (x, y) {
		var mask = $("<div></div>");
		mask.attr('id', 'M'+x+'M'+y);
		mask.attr('on', 1);
		mask.addClass('mask');
		return mask;
	},

	generateMask: function() {
		for (i=1; i<=this.max_Y; i++ ) {
			for (j=1; j<=this.max_X; j++) {
				$('#puzzle').append(this.newMask(i, j));
			}
		}
	},
	
	switchMask : function (id) {
	
		var cell = $('#'+id);
		if (cell.attr('on') == 0) {
			cell.css('background','');
			cell.attr('on', 1);
		}
		else {
			cell.css('background','rgba(255,255,255,0.1)');
			cell.attr('on', 0);
		}
	},
	
	switchAll : function (id) {
		this.switchMask(id);
		this.switchMask(this.dir(id, -1,  0));	// UP
		this.switchMask(this.dir(id,  1,  0));	// DOWN
		this.switchMask(this.dir(id,  0, -1));	// LEFT
		this.switchMask(this.dir(id,  0,  1));	// RIGHT
	},
}

function startNewGame(width, height, mask_size) {
	$('#puzzle').html('');
	Puzzle.construct(600, 400, 100);
}

$('.mask').live('click', function () {
	var id = $(this).attr('id');
	Puzzle.switchAll(id);
});

