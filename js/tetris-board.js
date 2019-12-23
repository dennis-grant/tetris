var GameBoard = function(mainDisplayId, rowCount, columnCount, cellWidth, cellHeight) {
	this.init = function(mainDisplayId, rowCount, columnCount, cellWidth, cellHeight) {
		this.mainDisplayId = mainDisplayId;
		this.rowCount = rowCount;
		this.columnCount = columnCount;
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.create();
	};

	this.create = function() {
		$("#" + this.mainDisplayId + " .board").css({
			width: (this.cellWidth + 2) * this.columnCount,
			height: (this.cellHeight + 2) * this.rowCount
		});

		for (var columnIndex = 1; columnIndex <= this.columnCount; columnIndex++) {
			for (var rowIndex = 1; rowIndex <= this.rowCount; rowIndex++) {
				$("#" + this.mainDisplayId + " .board").append("<div id='" + this.getCellId(columnIndex, rowIndex) + "' class='unoccupied_cell'></div>");
				$("#" + this.getCellId(columnIndex, rowIndex)).css({
					width: this.cellWidth + "px",
					height: this.cellHeight + "px",
					position: "absolute",
					left: (columnIndex - 1) * (this.cellWidth + 2), 
					top: (rowIndex - 1) * (this.cellHeight + 2)
				});
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
		$("#" + this.getCellId(col, row)).attr("class", className);
	};

	this.resetCell = function(col, row) {
		this.setCellStyle(col, row, "unoccupied_cell");
	};

	this.getCellId = function(col, row) {
		return "col" + col + "_row" + row;
	};

	this.init(mainDisplayId, rowCount, columnCount, cellWidth, cellHeight);
};
