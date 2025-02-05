/**
 * Changes the theme.
 */
function changeTheme() {
	let textColor = document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
	document.documentElement.style.setProperty("--txt-color", document.documentElement.style.getPropertyValue("--bg-color") || "#101010");
	document.documentElement.style.setProperty("--bg-color", textColor);
	updateCanvas();
};

/** The canvas context. @type {CanvasRenderingContext2D} */
let ctx;

/** The zoom amount. @type {number} */
let zoom = 0;

/**
 * Returns the scale factor.
 */
function getScale() {
	return 2 ** (zoom / 3);
};

/** The selected shape. @type {string} */
let selectedShape = "triangle";

/** Matrix representations of various shapes. */
const SHAPES = {
	triangle: Matrix.fromArray([[0, 0], [32, 0], [16, 32]]).transpose(),
	square: Matrix.fromArray([[0, 0], [32, 0], [32, 32], [0, 32]]).transpose(),
	pentagon: Matrix.fromArray([[0, 16], [8, 0], [24, 0], [32, 16], [16, 32]]).transpose(),
};

/** The transformation matrix. @type {Matrix} */
let transform = Matrix.identity(2);

/**
 * Returns the shape selector.
 */
function getShapeSelector() {
	let html = "";
	html += "Shape: <select id='shape' onchange='selectedShape = this.value; updateCanvas()'>";
	for (const shape in SHAPES) {
		if (SHAPES.hasOwnProperty(shape)) {
			html += "<option value='" + shape + "'>" + shape.charAt(0).toUpperCase() + shape.slice(1) + "</option>";
		};
	};
	html += "</select>";
	return html;
};

/**
 * Returns example matrix operations.
 */
function getExampleMatrixOperations() {
	let html = "";
	html += "Matrix Multiplication<br><br>";
	html += "<div class='row'>";
	let randomValues = Array.from({length: 4}, () => 2 + Math.floor(Math.random() * 2));
	let matrix1 = new Matrix(randomValues[0], randomValues[1]).map(() => Math.floor(Math.random() * 10));
	let matrix2 = new Matrix(randomValues[1], randomValues[2]).map(() => Math.floor(Math.random() * 10));
	let matrix3 = matrix1.multiply(matrix2);
	html += matrix1.toHTML();
	html += "<div class='operator'>&#215;</div>";
	html += matrix2.toHTML();
	html += "<div class='operator'>=</div>";
	html += matrix3.toHTML();
	html += "</div><br>";
	html += "Matrix Inversion<br><br>";
	html += "<div class='row'>";
	let matrix4 = new Matrix(randomValues[3], randomValues[3]).map(() => Math.floor(Math.random() * 10));
	let matrix5 = matrix4.inverse();
	html += matrix4.toHTML();
	if (matrix4.rows > 2) html += "<div style='margin: 0 -2ch " + (matrix4.rows - 1) + "em 0'>-1</div>";
	else html += "<div style='margin: 0 -0.5ch 1em 0'>-1</div>";
	html += "<div class='operator'>=</div>";
	html += matrix5.toHTML();
	html += "</div>";
};

/**
 * Updates the matrices.
 */
function updateUI() {
	let html = "";
	html += getShapeSelector() + "<br><br>";
	html += "<div class='row'>";
	html += "<div>Transformation Matrix:</div>";
	html += transform.toEditableHTML("transform", updateCanvas);
	html += "</div>";
	document.getElementById("UI").innerHTML = html;
};

/**
 * Draws a shape that is represented by a matrix on the canvas.
 * @param {Matrix} matrix - The matrix that represents the shape.
 */
function drawShape(matrix) {
	const scale = getScale();
	ctx.beginPath();
	ctx.moveTo(ctx.canvas.width / 2 + matrix.data[0][0] * scale, ctx.canvas.height / 2 - matrix.data[1][0] * scale);
	for (let col = 1; col < matrix.cols; col++) {
		ctx.lineTo(ctx.canvas.width / 2 + matrix.data[0][col] * scale, ctx.canvas.height / 2 - matrix.data[1][col] * scale);
	};
	ctx.closePath();
	ctx.stroke();
};

/**
 * Updates the canvas.
 */
function updateCanvas() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.strokeStyle = document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
	ctx.lineWidth = 2;
	// Draw the axes.
	ctx.globalAlpha = 0.5;
	ctx.beginPath();
	ctx.moveTo(ctx.canvas.width / 2, 0);
	ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, ctx.canvas.height / 2);
	ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
	ctx.stroke();
	ctx.globalAlpha = 1;
	// Draw the grid.
	const step = getScale() / (2 ** Math.round(zoom / 3 - 5));
	ctx.globalAlpha = 0.2;
	for (let x = ctx.canvas.width / 2 % step; x < ctx.canvas.width; x += step) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ctx.canvas.height);
		ctx.stroke();
	};
	for (let y = ctx.canvas.height / 2 % step; y < ctx.canvas.height; y += step) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(ctx.canvas.width, y);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	// Draw the selected shape and its transformation.
	ctx.strokeStyle = document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
	drawShape(SHAPES[selectedShape]);
	ctx.strokeStyle = "#F01010";
	drawShape(transform.multiply(SHAPES[selectedShape]));
};

window.addEventListener("load", () => {
	ctx = document.getElementById("canvas").getContext("2d");
	updateUI();
	updateCanvas();
});
