var RotateDirection = {
	CLOCKWISE: 1,
	COUNTER_CLOCKWISE: -1
};

var TetrisShape = function(board, cells, pivotCellIndex, className) {
	var self = this;

	this.init = function(board, cells, pivotCellIndex, className) {
		this.board = board;
		this.cells = cells;
		this.setOccupiedCells();
		this.pivotCellIndex = pivotCellIndex;
		this.className = className;
	};

	this.getCellId = function(col, row) {
		return "c"+ col + "-r" + row;
	};

	this.setOccupiedCells = function() {
		this.occupiedCells = {};

		for (var i = 0; i < this.cells.length; i++) {
			this.occupiedCells[this.getCellId(this.cells[i].col, this.cells[i].row)] = true;
		}
	};

	this.clone = function() {
		var clonedCells;

		clonedCells = [];
		for (var i = 0; i < this.cells.length; i++) {
			clonedCells[clonedCells.length] = {
				col: this.cells[i].col,
				row: this.cells[i].row,
				className: this.cells[i].className
			};
		}

		return new TetrisShape(this.board, clonedCells, this.pivotCellIndex, this.className);
	};

	this.move = function(colChange, rowChange, landedShape) {
		var moved;

		this.hide();
		this.changePosition(colChange, rowChange);
		moved = true;
		if (this.canDisplayCorrectly(landedShape) == false) {
			this.changePosition(-1 * colChange, -1 * rowChange);
			moved = false;
		}
		this.show();

		return moved;
	};

	this.drop = function(landedShape) {
		while (this.move(0, 1, landedShape)) {}
	};

	this.rotate = function(direction, landedShape) {
		if (this.pivotCellIndex != -1) {
			this.hide();
			this.changeDirection(direction);
			if (this.canDisplayCorrectly(landedShape) == false) {
				if (direction == RotateDirection.CLOCKWISE) {
					direction = RotateDirection.COUNTER_CLOCKWISE;
				}
				else {
					direction = RotateDirection.CLOCKWISE;
				}
				this.changeDirection(direction);
			}
			this.show();
		}
	};

	this.changePosition = function(colChange, rowChange) {
		for (var i = 0; i < this.cells.length; i++) {
			delete this.occupiedCells[this.getCellId(this.cells[i].col, this.cells[i].row)];

			this.cells[i].col += colChange;
			this.cells[i].row += rowChange;

			this.occupiedCells[this.getCellId(this.cells[i].col, this.cells[i].row)] = true;
		}
	};

	this.changeDirection = function(direction) {
		var pivotCell;
		var relativeRowPosition;
		var relativeColPosition;

		pivotCell = this.cells[this.pivotCellIndex];
		for (var i = 0; i < this.cells.length; i++) {
			delete this.occupiedCells[this.getCellId(this.cells[i].col, this.cells[i].row)];

			relativeColPosition = this.cells[i].col - pivotCell.col;
			relativeRowPosition = this.cells[i].row - pivotCell.row;

			if (relativeColPosition > 0) {
				this.cells[i].row = pivotCell.row + (relativeColPosition * direction);
			}
			else if (relativeColPosition < 0) {
				this.cells[i].row = pivotCell.row + (relativeColPosition * direction);
			}
			else {
				this.cells[i].row = pivotCell.row;
			}

			if (relativeRowPosition > 0) {
				this.cells[i].col = pivotCell.col - (relativeRowPosition * direction);
			}
			else if (relativeRowPosition < 0) {
				this.cells[i].col = pivotCell.col - (relativeRowPosition * direction);
			}
			else {
				this.cells[i].col = pivotCell.col;
			}

			this.occupiedCells[this.getCellId(this.cells[i].col, this.cells[i].row)] = true;
		}
	};

	this.canDisplayCorrectly = function(landedShape) {
		var canDisplay;
		var overlap;

		canDisplay = true;
		for (var i = 0; i < this.cells.length && canDisplay; i++) {
			canDisplay = (this.cells[i].col >= 1) && (this.cells[i].col <= this.board.columnCount);
			canDisplay = canDisplay && (this.cells[i].row >= 1) && (this.cells[i].row <= this.board.rowCount);
		}

		overlap = this.getOverlap(landedShape);
		canDisplay = canDisplay && (overlap.cells.length == 0);

		return canDisplay;
	};

	this.hide = function() {
		for (var i = 0; i < this.cells.length; i++) {
			this.board.resetCell(this.cells[i].col, this.cells[i].row);
		}
	};

	this.show = function() {
		var tmpClassName;

		for (var i = 0; i < this.cells.length; i++) {
			tmpClassName = this.cells[i].className;
			if (tmpClassName  == undefined) {
				tmpClassName = this.className;
			}
			this.board.setCellStyle(this.cells[i].col, this.cells[i].row, tmpClassName);
		}
	};

	this.add = function(shape) {
		var tmpCol;
		var tmpRow;

		for (var i = 0; i < shape.cells.length; i++) {
			if (shape.cells[i].className == undefined) {
				shape.cells[i].className = shape.className;
			}
			this.cells[this.cells.length] = shape.cells[i];
			tmpCol = shape.cells[i].col;
			tmpRow = shape.cells[i].row;
			this.occupiedCells[this.getCellId(tmpCol, tmpRow)] = true;
		}
	};

	this.getOverlap = function(shape) {
		var tmpCells;

		tmpCells = [];
		for (var i = 0; i < shape.cells.length; i++) {
			if (this.occupiedCells[this.getCellId(shape.cells[i].col, shape.cells[i].row)] == true) {
				tmpCells[tmpCells.length] = {col: shape.cells[i].col, row: shape.cells[i].row};
			}
		}

		return new TetrisShape(this.board, tmpCells, -1, "red");
	};

	this.isRowFullyOccupied = function(row, colCount) {
		var occupied;

		occupied = true;
		for (var col = 1; col <= colCount && occupied == true; col++) {
			occupied = occupied && this.occupiedCells[this.getCellId(col, row)]; 
		}

		return occupied;
	};

	this.deleteCellsInRow = function(row) {
		var tmpCol;
		var tmpRow;

		for (var i = this.cells.length - 1; i >= 0; i--) {
			if (this.cells[i].row == row) {
				this.board.resetCell(this.cells[i].col, row);
				delete this.occupiedCells[this.getCellId(this.cells[i].col, row)];
				this.cells.splice(i, 1);
			}
		}
	};

	this.horizontalSplit = function(row) {
		var topCells;
		var bottomCells;
		var tmpCell;

		topCells = [];
		bottomCells = [];
		for (var i = 0; i < this.cells.length; i++) {
			tmpCell = {col: this.cells[i].col, row: this.cells[i].row, className: this.cells[i].className};
			if (this.cells[i].row <= row) {
				topCells[topCells.length] = tmpCell;
			}
			else {
				bottomCells[bottomCells.length] = tmpCell;
			}
		}

		return {
			top: new TetrisShape(this.board, topCells, -1, "red"),
			bottom: new TetrisShape(this.board, bottomCells, -1, "red")
		};
	};

	this.init(board, cells, pivotCellIndex, className);
};
