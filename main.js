function changeTheme() {
	let textColor = document.documentElement.style.getPropertyValue("--txt-color") || "#F0F0F0";
	document.documentElement.style.setProperty("--txt-color", document.documentElement.style.getPropertyValue("--bg-color") || "#101010");
	document.documentElement.style.setProperty("--bg-color", textColor);
};

function update() {
	let html = "<br>Matrix Multiplication<br><br>";
	html += "<div class='row'>";
	let randomValues = Array.from({length: 4}, () => 1 + Math.floor(Math.random() * 5));
	let matrix1 = new Matrix(randomValues[0], randomValues[1]).map(() => Math.floor(Math.random() * 10));
	let matrix2 = new Matrix(randomValues[1], randomValues[2]).map(() => Math.floor(Math.random() * 10));
	let matrix3 = matrix1.multiply(matrix2);
	html += matrix1.toHTML();
	html += "<div class='operator'>&#x00D7;</div>";
	html += matrix2.toHTML();
	html += "<div class='operator'>=</div>";
	html += matrix3.toHTML();
	html += "</div><br>";
	html += "Matrix Inversion<br><br>";
	html += "<div class='row'>";
	let matrix4 = new Matrix(randomValues[3], randomValues[3]).map(() => Math.floor(Math.random() * 10));
	let matrix5 = matrix4.inverse();
	html += matrix4.toHTML();
	html += "<div style='margin-bottom: " + Math.max(matrix4.rows - 1, 1) + "em'>-1</div>";
	html += "<div class='operator'>=</div>";
	html += matrix5.toHTML();
	html += "</div><br>";
	html += "<button onclick='changeTheme()'>Change Theme</button><br>";
	document.body.innerHTML = html;
};

window.addEventListener("load", () => {
	update();
});
