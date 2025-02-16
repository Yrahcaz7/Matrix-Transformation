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
		return new Matrix(data.length, data[0].length).map((_, row, col) => data[row][col]);
	};

	/**
	 * Returns a new Matrix object that is the identity matrix of the given size.
	 * @param {number} size - The size of the identity matrix.
	 */
	static identity(size) {
		return new Matrix(size, size).map((_, row, col) => row === col ? 1 : 0);
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
	 * Returns a new matrix that is the result of:
	 * - Adding the `value` matrix to the current matrix if `value` is a matrix.
	 * - Adding `value` to each element of the current matrix if `value` is a scalar.
	 * 
	 * @param {number | Matrix} value - The scalar or matrix to add to the current matrix.
	 */
	add(value) {
		if (value instanceof Matrix) {
			if (this.rows !== value.rows || this.cols !== value.cols) {
				console.error("The number of rows and columns of the matrices must match.");
				return new Matrix(NaN, NaN);
			};
			return this.map((val, row, col) => val + value.data[row][col]);
		};
		return this.map(val => val + value);
	};

	/**
	 * Returns a new matrix that is the result of:
	 * - Subtracting the `value` matrix from the current matrix if `value` is a matrix.
	 * - Subtracting `value` from each element of the current matrix if `value` is a scalar.
	 * 
	 * @param {number | Matrix} value - The scalar or matrix to subtract from the current matrix.
	 */
	subtract(value) {
		if (value instanceof Matrix) {
			if (this.rows !== value.rows || this.cols !== value.cols) {
				console.error("The number of rows and columns of the matrices must match.");
				return new Matrix(NaN, NaN);
			};
			return this.map((val, row, col) => val - value.data[row][col]);
		};
		return this.map(val => val - value);
	};

	/**
	 * Returns a new matrix that is the result of multiplying a scalar or matrix with the current matrix.
	 * @param {number | Matrix} value - The scalar or matrix to multiply with the current matrix.
	 */
	multiply(value) {
		if (value instanceof Matrix) {
			if (this.cols !== value.rows) {
				console.error("The number of columns in the first matrix must match the number of rows in the second matrix.");
				return new Matrix(NaN, NaN);
			};
			return new Matrix(this.rows, value.cols).map((_, row, col) => {
				let val = 0;
				for (let k = 0; k < this.cols; k++) {
					val += this.data[row][k] * value.data[k][col];
				};
				return val;
			});
		};
		return this.map(val => val * value);
	};

	/**
	 * Returns the determinant of the current matrix.
	 */
	determinant() {
		if (this.rows !== this.cols) {
			console.error("The matrix must be square.");
			return NaN;
		};
		if (this.rows === 0) {
			return 1;
		};
		if (this.rows === 1) {
			return this.data[0][0];
		};
		if (this.rows === 2) {
			return this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0];
		};
		let determinant = 0;
		for (let col = 0; col < this.cols; col++) {
			let minor = new Matrix(this.rows - 1, this.cols - 1).map((_, row2, col2) => this.data[row2 + 1][col2 < col ? col2 : col2 + 1]);
			determinant += (col % 2 === 0 ? 1 : -1) * this.data[0][col] * minor.determinant();
		};
		return determinant;
	};

	/**
	 * Returns the adjugate of the current matrix.
	 */
	adjugate() {
		if (this.rows !== this.cols) {
			console.error("The matrix must be square.");
			return new Matrix(NaN, NaN);
		};
		let cofactor = new Matrix(this.rows, this.cols).map((_, row, col) => {
			let minor = new Matrix(this.rows - 1, this.cols - 1).map((_, row2, col2) => this.data[row2 < row ? row2 : row2 + 1][col2 < col ? col2 : col2 + 1]);
			return (row + col) % 2 === 0 ? minor.determinant() : -minor.determinant();
		});
		return cofactor.transpose();
	};

	/**
	 * Returns a new matrix that is the inverse of the current matrix.
	 */
	inverse() {
		if (this.rows !== this.cols) {
			console.error("The matrix must be square.");
			return new Matrix(NaN, NaN);
		};
		let determinant = this.determinant();
		if (determinant === 0) {
			console.error("The determinant of the matrix is zero.");
			return new Matrix(NaN, NaN);
		};
		return this.adjugate().multiply(1 / determinant);
	};

	/**
	 * Returns a two-dimensional array containing the data in the matrix.
	 */
	toArray() {
		return this.copy().data;
	};

	/**
	 * Returns a string representation of the matrix.
	 * @param {number} places - The number of decimal places to show. Defaults to `3`.
	 */
	toString(places = 3) {
		return "(" + this.data.map(row => row.map(val => Math.round(val * (10 ** places)) / (10 ** places)).join(" ")).join("\n") + ")";
	};

	/**
	 * Returns an HTML representation of the matrix.
	 * @param {number} places - The number of decimal places to show. Defaults to `3`.
	 */
	toHTML(places = 3) {
		if (this.rows !== this.rows || this.cols !== this.cols) {
			return "<div class='matrix'><div>Invalid matrix</div></div>";
		};
		let parenthesisStyle = "font-size: " + Math.max(this.rows, 2) + "em";
		let html = "<div class='matrix'>";
		html += "<div class='left-parenthesis' style='" + parenthesisStyle + "'>(</div>";
		html += "<table><tr>";
		html += this.data.map(row => "<td>" + row.map(val => Math.round(val * (10 ** places)) / (10 ** places)).join("</td><td>") + "</td>").join("</tr><tr>");
		html += "</tr></table>";
		html += "<div class='right-parenthesis' style='" + parenthesisStyle + "'>)</div>";
		return html + "</div>";
	};

	/**
	 * Returns an editable HTML representation of the matrix.
	 * @param {string} name - The name of the matrix.
	 * @param {function} updateFunction - The function to call when the matrix is edited.
	 * @param {number} places - The number of decimal places to show. Defaults to `3`.
	 */
	toEditableHTML(name, updateFunction, places = 3) {
		if (this.rows !== this.rows || this.cols !== this.cols) {
			return "<div class='matrix'><div>Invalid matrix</div></div>";
		};
		let parenthesisStyle = "font-size: " + Math.max(this.rows, 2) + "em";
		let html = "<div class='matrix'>";
		html += "<div class='left-parenthesis' style='" + parenthesisStyle + "'>(</div>";
		html += "<table>";
		for (let row = 0; row < this.rows; row++) {
			html += "<tr>";
			for (let col = 0; col < this.cols; col++) {
				let num = Math.round(this.data[row][col] * (10 ** places)) / (10 ** places);
				html += "<td><input type='number' id='" + name + "-" + row + "-" + col + "' value='" + num + "' step='any' oninput='" + name + ".data[" + row + "][" + col + "] = +this.value; " + updateFunction.name + "()'></td>";
			};
			html += "</tr>";
		};
		html += "</table>";
		html += "<div class='right-parenthesis' style='" + parenthesisStyle + "'>)</div>";
		return html + "</div>";
	};
};
