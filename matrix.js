class Matrix {
	/** The number of rows in the matrix. @type {number} */
	rows = 0;
	/** The number of columns in the matrix. @type {number} */
	cols = 0;
	/** The data stored in the matrix. @type {number[][]} */
	data = [];

	/**
	 * Returns a new Matrix object with the given number of rows and columns.
	 * @param {number} rows - The number of rows in the matrix.
	 * @param {number} cols - The number of columns in the matrix.
	 */
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.data = Array.from({length: this.rows}, () => Array(this.cols).fill(0));
	};

	/**
	 * Returns a new Matrix object that contains the given data.
	 * @param {number[][]} data - The data to store in the matrix. 
	 */
	static fromArray(data) {
		let matrix = new Matrix(data.length, data[0].length);
		for (let row = 0; row < matrix.rows; row++) {
			matrix.data[row] = data[row].slice();
		};
		return matrix;
	};

	/**
	 * Returns a two-dimensional array containing the data in the matrix.
	 */
	toArray() {
		let arr = [];
		for (let row = 0; row < this.rows; row++) {
			arr.push(this.data[row].slice());
		};
		return arr;
	};

	/**
	 * Calls a defined callback function on each element of the current matrix, and returns a new matrix that contains the results.
	 * @param {(val: number, row: number, col: number) => number} callbackfn - A function that accepts up to three numerical arguments.
	 */
	map(callbackfn) {
		let matrix = new Matrix(this.rows, this.cols);
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				matrix.data[row][col] = callbackfn(this.data[row][col], row, col);
			};
		};
		return matrix;
	};

	/**
	 * Returns a new matrix that is a copy of the current matrix.
	 */
	copy() {
		return this.map(val => val);
	};

	/**
	 * Returns a new matrix that is the transpose of the current matrix.
	 */
	transpose() {
		return new Matrix(this.cols, this.rows).map((_, row, col) => this.data[col][row]);
	};

	/**
	 * Returns a new matrix that is the result of adding a matrix to the current matrix.
	 * @param {Matrix} matrix - The matrix to add to the current matrix.
	 */
	add(matrix) {
		if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
			console.error("The number of rows and columns of the matrices must match.");
			return this.copy();
		};
		return this.map((val, row, col) => val + matrix.data[row][col]);
	};

	/**
	 * Returns a new matrix that is the result of subtracting a matrix from the current matrix.
	 * @param {Matrix} matrix - The matrix to subtract from the current matrix.
	 */
	subtract(matrix) {
		if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
			console.error("The number of rows and columns of the matrices must match.");
			return this.copy();
		};
		return this.map((val, row, col) => val - matrix.data[row][col]);
	};

	/**
	 * Returns a new matrix that is the result of multiplying a matrix with the current matrix.
	 * @param {Matrix} matrix 
	 */
	multiply(matrix) {
		if (this.cols !== matrix.rows) {
			console.error("The number of columns in the first matrix must match the number of rows in the second matrix.");
			return this.copy();
		};
		return new Matrix(this.rows, matrix.cols).map((_, row, col) => {
			let val = 0;
			for (let k = 0; k < this.cols; k++) {
				val += this.data[row][k] * matrix.data[k][col];
			};
			return val;
		});
	};

	/**
	 * Returns a string representation of the matrix.
	 */
	toString() {
		return "(" + this.data.map(row => row.join(" ")).join("\n") + ")";
	};

	/**
	 * Returns an HTML representation of the matrix.
	 */
	toHTML() {
		let html = "<div class='matrix'>";
		html += "<div class='left-parenthesis' style='font-size: " + this.rows + "em'>(</div>";
		html += "<table><tr>";
		html += this.data.map(row => "<td>" + row.join("</td><td>") + "</td>").join("</tr><tr>");
		html += "</tr></table>";
		html += "<div class='right-parenthesis' style='font-size: " + this.rows + "em'>)</div>";
		return html + "</div>";
	};
};
