class Shape {
	/** The points of the shape. @type {Matrix} */
	points = new Matrix(0, 0);

	/**
	 * Returns a new shape with the given points.
	 * @param {Matrix | number[][]} points - The points of the shape.
	 */
	constructor(points) {
		if (points instanceof Matrix) {
			this.points = points;
		} else {
			this.points = Matrix.fromArray(points).transpose();
		};
	};

	/**
	 * Returns a new shape that is a copy of the current shape.
	 */
	copy() {
		return new Shape(this.points.copy());
	};

	/**
	 * Adds the given points to the current shape.
	 * @param {Matrix | number[][]} points - The points to add.
	 */
	addPoints(points) {
		if (points instanceof Matrix) {
			this.points.cols += points.cols;
			for (let row = 0; row < this.points.rows; row++) {
				this.points.data[row].push(...points.data[row]);
			};
		} else {
			for (let index = 0; index < points.length; index++) {
				for (let row = 0; row < this.points.rows; row++) {
					this.points.data[row].push(points[index][row]);
				};
			};
		};
	};

	/**
	 * Returns a new shape that is the result of transforming the current shape with the given matrix.
	 * @param {Matrix} transform - The transformation matrix.
	 */
	transform(transform) {
		let shape = this.copy();
		shape.points = transform.multiply(this.points);
		return shape;
	};
};
