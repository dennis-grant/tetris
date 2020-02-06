var GameBoard = function($mainDisplay, rowCount, columnCount, cellWidth, cellHeight) {
	this.init = function($mainDisplay, rowCount, columnCount, cellWidth, cellHeight) {
		this.$board = $mainDisplay.find("> .board");
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.create();
	};

	this.create = function() {
		this.$board.css({
			width: (this.cellWidth + 2) * this.columnCount,
			height: (this.cellHeight + 2) * this.rowCount
		});

		for (var columnIndex = 1; columnIndex <= this.columnCount; columnIndex++) {
			for (var rowIndex = 1; rowIndex <= this.rowCount; rowIndex++) {
				var $cell = $(`<div class="unoccupied_cell"></div>`);
				$cell
					.attr("address", this.getCellId(columnIndex, rowIndex))
					.css({
						width: this.cellWidth + "px",
						height: this.cellHeight + "px",
						position: "absolute",
						left: (columnIndex - 1) * (this.cellWidth + 2), 
						top: (rowIndex - 1) * (this.cellHeight + 2)
					});
				this.$board.append($cell);
			}
		}
	};

	this.reset = function() {
		for (var columnIndex = 1; columnIndex <= this.columnCount; columnIndex++) {
			for (var rowIndex = 1; rowIndex <= this.rowCount; rowIndex++) {
				this.resetCell(columnIndex, rowIndex);
			}
		}
	};

	this.setCellStyle = function(col, row, className) {
		this.$board.find(`[address=${this.getCellId(col, row)}]`).attr("class", className);
	};

	this.resetCell = function(col, row) {
		this.setCellStyle(col, row, "unoccupied_cell");
	};

	this.getCellId = function(col, row) {
		return "col" + col + "_row" + row;
	};

	this.init($mainDisplay, rowCount, columnCount, cellWidth, cellHeight);
};
