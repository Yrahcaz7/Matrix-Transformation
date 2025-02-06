/**
 * Returns the text color.
 */
function getTextColor() {
	return document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
};

/**
 * Changes the theme.
 */
function changeTheme() {
	let textColor = getTextColor();
	document.documentElement.style.setProperty("--txt-color", document.documentElement.style.getPropertyValue("--bg-color") || "#101010");
	document.documentElement.style.setProperty("--bg-color", textColor);
	updateCanvas(false);
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

/** Various shapes. */
const SHAPES = {
	triangle: new Shape([[0, 0], [32, 0], [16, 32]]),
	square: new Shape([[0, 0], [32, 0], [32, 32], [0, 32]]),
	pentagon: new Shape([[0, 16], [8, 0], [24, 0], [32, 16], [16, 32]]),
	hexagon: new Shape([[0, 16], [8, 0], [24, 0], [32, 16], [24, 32], [8, 32]]),
	heptagon: new Shape([[0, 8], [8, 0], [24, 0], [32, 8], [32, 24], [16, 32], [0, 24]]),
	octagon: new Shape([[0, 8], [8, 0], [24, 0], [32, 8], [32, 24], [24, 32], [8, 32], [0, 24]]),
	hourglass: new Shape([[8, 0], [24, 0], [16, 16], [24, 32], [8, 32], [16, 16]]),
	star: new Shape([[0, 16], [12, 12], [16, 0], [20, 12], [32, 16], [20, 20], [16, 32], [12, 20]]),
};

/** The list of transforms. @type {Transform[]} */
let transforms = [];

/** The transformed shape. */
let transformedShape = SHAPES.triangle.copy();

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
 * Returns the shape selector.
 */
function getShapeSelector() {
	let html = "";
	html += "Shape: <select id='shape' onchange='selectedShape = this.value; updateCanvas()'>";
	for (const shape in SHAPES) {
		if (SHAPES.hasOwnProperty(shape)) {
			html += "<option value='" + shape + "'" + (shape === selectedShape ? " selected" : "") + ">" + shape.charAt(0).toUpperCase() + shape.slice(1) + "</option>";
		};
	};
	html += "</select>";
	return html;
};

/**
 * Returns the transform editor.
 */
function getTransformEditor() {
	let html = "";
	html += "Transforms<br><br>";
	if (transforms.length > 0) {
		html += "<div id='transforms'>";
		for (let index = 0; index < transforms.length; index++) {
			if (index > 0) html += "<br>";
			html += transforms[index].toEditableHTML("transforms[" + index + "]", updateUI, updateCanvas);
		};
		html += "</div><br>";
	};
	html += "<button onclick='transforms.push(new Transform(TRANSFORM.TRANSLATE)); updateUI()'>Add Transform</button> ";
	html += "<button onclick='transforms.pop(); updateUI(); updateCanvas()'" + (transforms.length === 0 ? " disabled" : "") + ">Remove Transform</button>";
	return html;
};

/**
 * Updates the matrices.
 */
function updateUI() {
	let html = "";
	html += getShapeSelector() + "<br><br>";
	html += getTransformEditor() + "<br><br>";
	document.getElementById("UI").innerHTML = html;
};

/**
 * Updates the canvas.
 * @param {boolean} recalculate - Whether to recalculate the selected shape. Defaults to `true`.
 */
function updateCanvas(recalculate = true) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = "transparent";
	ctx.strokeStyle = getTextColor() + "80";
	ctx.lineWidth = 2;
	// Draw the axes.
	ctx.beginPath();
	ctx.moveTo(ctx.canvas.width / 2, 0);
	ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, ctx.canvas.height / 2);
	ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
	ctx.stroke();
	// Draw the grid.
	const step = getScale() / (2 ** Math.round(zoom / 3 - 5));
	ctx.strokeStyle = getTextColor() + "40";
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
	// Recalculate the selected shape.
	if (recalculate) transformedShape = SHAPES[selectedShape].transform(transforms);
	// Draw the selected shape and its transformation.
	ctx.fillStyle = getTextColor() + "80";
	ctx.strokeStyle = getTextColor();
	SHAPES[selectedShape].draw(ctx, getScale());
	ctx.fillStyle = "#F0101080";
	ctx.strokeStyle = "#F01010";
	transformedShape.draw(ctx, getScale());
};

/**
 * Sets the zoom of the canvas to the specified amount.
 * @param {number} amount - The amount to set the zoom to.
 */
function zoomCanvas(amount) {
	document.getElementById("zoom-in").disabled = amount >= 3000;
	document.getElementById("zoom-out").disabled = amount <= -3000;
	zoom = amount;
	updateCanvas(false);
};

window.addEventListener("load", () => {
	ctx = document.getElementById("canvas").getContext("2d");
	updateUI();
	updateCanvas(false);
});
