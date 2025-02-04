function update() {
	let html = "<br>Matrix Multiplication<br><br>";
	html += "<div class='row'>";
	let matrix1 = new Matrix(2, 3).map((_, row, col) => row + col);
	let matrix2 = new Matrix(3, 4).map((_, row, col) => row + col);
	let matrix3 = matrix1.multiply(matrix2);
	html += matrix1.toHTML();
	html += "<div class='operator'>&#x00D7;</div>";
	html += matrix2.toHTML();
	html += "<div class='operator'>=</div>";
	html += matrix3.toHTML();
	html += "</div>";
	html += "<div class='row'>";
	let matrix4 = new Matrix(8, 2).map(() => Math.floor(Math.random() * 10));
	let matrix5 = new Matrix(2, 5).map(() => Math.floor(Math.random() * 10));
	let matrix6 = matrix4.multiply(matrix5);
	html += matrix4.toHTML();
	html += "<div class='operator'>&#x00D7;</div>";
	html += matrix5.toHTML();
	html += "<div class='operator'>=</div>";
	html += matrix6.toHTML();
	html += "</div><br>";
	document.body.innerHTML = html;
};

window.addEventListener("load", () => {
	update();
});
