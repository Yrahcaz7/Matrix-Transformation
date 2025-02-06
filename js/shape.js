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
	 * Returns a new shape that is the result of applying the given transformations to the current shape.
	 * @param {Transform[]} transforms - The transformations.
	 */
	transform(transforms) {
		let shape = this.copy();
		shape.points = Transform.transformMatrix(shape.points, transforms);
		return shape;
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
	 * Draws the shape on the given canvas context with the given scale.
	 * @param {CanvasRenderingContext2D} context - The canvas context.
	 * @param {number} scale - The scale of the shape. Defaults to `1`.
	 */
	draw(context, scale = 1) {
		context.beginPath();
		context.moveTo(context.canvas.width / 2 + this.points.data[0][0] * scale, context.canvas.height / 2 - this.points.data[1][0] * scale);
		for (let col = 1; col < this.points.cols; col++) {
			context.lineTo(context.canvas.width / 2 + this.points.data[0][col] * scale, context.canvas.height / 2 - this.points.data[1][col] * scale);
		};
		context.closePath();
		context.fill();
		context.stroke();
	};
};
