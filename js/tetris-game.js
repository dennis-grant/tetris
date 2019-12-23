var Tetris = function(mainDisplayId) {
	var COLUMN_COUNT		= 10;
	var ROW_COUNT			= 18;
	var CELL_WIDTH			= 22;
	var CELL_HEIGHT			= 22;
	var WAIT_BETWEEN_MOVE	= 500;
	var UP					= 38;
	var DOWN				= 40;
	var LEFT				= 37;
	var RIGHT				= 39;

	var SCORE_TABLE = {
		"rc:0" : 0,
		"rc:1" : 50,
		"rc:2" : 120,
		"rc:3" : 210,
		"rc:4" : 320
	};

	this.init = function(mainDisplayId) {
		this.mainDisplayId = mainDisplayId;
		$("#" + this.mainDisplayId).css({
			width: (CELL_WIDTH + 2) * COLUMN_COUNT + 100
		});
		this.runningIntervalId = undefined;
		this.isRunning = false;
		this.score = 0;
		this.board = new GameBoard(mainDisplayId, ROW_COUNT, COLUMN_COUNT, CELL_WIDTH, CELL_HEIGHT);
		this.landedShape = new TetrisShape(this.board, [], -1, "");
		this.createShapes();
		this.setupEventHandlers();
	};

	this.setupEventHandlers = function() {
		$("#btnStart").bind("click", $.proxy(this.btnStartClicked, this));
		$("#btnPause").bind("click", $.proxy(this.btnPauseClicked, this));
		$("#btnRestart").bind("click", $.proxy(this.btnRestartClicked, this));
		$(document).bind("keyup", $.proxy(this.handleKeyboardInput, this));
	};

	this.btnStartClicked = function(e) {
		this.start();
		$("#btnStart").hide();
		$("#btnPause").show();
	};

	this.btnPauseClicked = function(e) {
		this.stop();
		$("#btnPause").hide();
		$("#btnRestart").show();
	};

	this.btnRestartClicked = function(e) {
		this.go();
		$("#btnRestart").hide();
		$("#btnPause").show();
	};

	this.handleKeyboardInput = function(e) {
		switch (e.which) {
			case LEFT:
				this.currentShape.move(-1, 0, this.landedShape);
				break;
			case RIGHT:
				this.currentShape.move(1, 0, this.landedShape);
				break;
			case UP:
				this.currentShape.rotate(RotateDirection.CLOCKWISE, this.landedShape);
				break;
			case DOWN:
				this.currentShape.move(0, 1, this.landedShape);
				break;
			case 32:
				this.dropShape();
				break;
		}
	};

	this.getNextShape = function() {
		return this.shapes[this.getRandomPosition(this.shapes.length - 1)].clone();
	};

	this.createShapes = function() {
		this.shapes = [
			new TetrisShape(
				this.board,
				[{col: 5, row: 1},	{col: 6, row: 1}, {col: 6, row: 2}, {col: 7, row: 2}],
				1,
				"red_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 6, row: 1},	{col: 5, row: 2}, {col: 6, row: 2}, {col: 7, row: 2}],
				2,
				"green_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 6, row: 1},	{col: 7, row: 1}, {col: 5, row: 2}, {col: 6, row: 2}],
				0,
				"yellow_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 6, row: 1}, {col: 7, row: 1}, {col: 6, row: 2}, {col: 7, row: 2}],
				-1,
				"purple_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 6, row: 1}, {col: 6, row: 2}, {col: 6, row: 3}, {col: 7, row: 3}],
				2,
				"blue_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 7, row: 1}, {col: 7, row: 2}, {col: 6, row: 3}, {col: 7, row: 3}],
				2,
				"grey_piece"
			),
			new TetrisShape(
				this.board,
				[{col: 5, row: 1}, {col: 6, row: 1}, {col: 7, row: 1}, {col: 8, row: 1}],
				1,
				"dark_green_piece"
			)
		];
	};

	this.autoMoveShape = function() {
		if (this.isRunning == false) {
			// do nothing
		}
		else if (this.currentShape.move(0, 1, this.landedShape) == false) {
			this.stop();
			this.removeFullRows();
			this.playNextShape();
		}
	};

	this.dropShape = function() {
		if (this.isRunning == true) {
			this.stop();
			this.currentShape.drop(this.landedShape);
			this.removeFullRows();
			this.playNextShape();
		}
	};

	this.removeFullRows = function() {
		var shapes;
		var row;
		var rowsDeleted;

		this.landedShape.add(this.currentShape);
		rowsDeleted = 0;
		row = this.board.rowCount;
		do {
			if (this.landedShape.isRowFullyOccupied(row, this.board.columnCount)) {
				shapes = this.landedShape.horizontalSplit(row);
				this.landedShape = shapes.bottom;
				shapes.top.deleteCellsInRow(row);
				shapes.top.move(0, 1, this.landedShape);
				this.landedShape.add(shapes.top);

				rowsDeleted++;
			}
			else {
				row--;
			}
		} while (row >= 1);

		this.score += this.getScore(rowsDeleted);
		this.showScore();
	};

	this.getScore = function(rows) {
		return SCORE_TABLE["rc:" + rows];
	};

	this.showScore = function() {
		$("#" + this.mainDisplayId + " .score").html(this.score);
	};

	this.playNextShape = function() {
		var tmpShape;

		this.currentShape = this.getNextShape();
		tmpShape = this.currentShape.getOverlap(this.landedShape);
		if (tmpShape.cells.length == 0) {
			this.currentShape.show();
			this.go();
		}
		else {
			$("#btnPause").hide();
			$("#btnStart").show();
			alert("Game Over!");
		}
	};

	this.start = function() {
		this.score = 0;
		this.showScore();
		this.landedShape = new TetrisShape(this.board, [], -1, "");
		this.board.reset();
		this.playNextShape();
	};

	this.stop = function() {
		if (this.isRunning == true) {
			clearInterval(this.runningIntervalId);
			this.runningIntervalId = undefined;
			this.isRunning = false;
		}
	};

	this.go = function() {
		this.runningIntervalId = setInterval($.proxy(this.autoMoveShape, this), WAIT_BETWEEN_MOVE);
		this.isRunning = true;
	};

	this.getRandomPosition = function(highestPosition) {
		return Math.floor(Math.random() * (highestPosition + 1));
	};

	this.init(mainDisplayId);
};
