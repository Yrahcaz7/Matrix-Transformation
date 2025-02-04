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
let zoom = 40;

/** The example triangle. @type {Matrix} */
const EXAMPLE_TRIANGLE = Matrix.fromArray([[0, 0], [2, 0], [2, 1]]).transpose();

const TRANSFORMED_TRIANGLES = [
	Matrix.fromArray([[-1, 2], [0, -1]]).multiply(EXAMPLE_TRIANGLE).subtract(1),
	Matrix.fromArray([[1, 0], [1, 1]]).multiply(EXAMPLE_TRIANGLE),
	Matrix.fromArray([[0, 2], [-2, 0]]).multiply(EXAMPLE_TRIANGLE),
	Matrix.fromArray([[-1, -2], [1, 1]]).multiply(EXAMPLE_TRIANGLE),
];

/**
 * Draws a shape that is represented by a matrix on the canvas.
 * @param {Matrix} matrix - The matrix that represents the shape.
 */
function drawShape(matrix) {
	ctx.beginPath();
	ctx.moveTo(ctx.canvas.width / 2 + matrix.data[0][0] * zoom, ctx.canvas.height / 2 - matrix.data[1][0] * zoom);
	for (let col = 1; col < matrix.cols; col++) {
		ctx.lineTo(ctx.canvas.width / 2 + matrix.data[0][col] * zoom, ctx.canvas.height / 2 - matrix.data[1][col] * zoom);
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
	ctx.globalAlpha = 0.2;
	for (let x = 0; x < ctx.canvas.width; x += zoom) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ctx.canvas.height);
		ctx.stroke();
	};
	for (let y = 0; y < ctx.canvas.height; y += zoom) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(ctx.canvas.width, y);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	// Draw the example triangle.
	ctx.strokeStyle = document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
	drawShape(EXAMPLE_TRIANGLE);
	ctx.strokeStyle = "#F01010";
	for (let triangle of TRANSFORMED_TRIANGLES) {
		drawShape(triangle);
	};
};

/**
 * Updates the matrices.
 */
function updateMatrices() {
	let html = "Matrix Multiplication<br><br>";
	html += "<div class='row'>";
	let randomValues = Array.from({length: 4}, () => 1 + Math.floor(Math.random() * 5));
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
	document.getElementById("matrices").innerHTML = html;
};

window.addEventListener("load", () => {
	ctx = document.getElementById("canvas").getContext("2d");
	updateCanvas();
	updateMatrices();
});
