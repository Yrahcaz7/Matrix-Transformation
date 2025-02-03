function update() {
    let html = "Matrix Multiplication<br><br>";
    html += "<div class='flex'>";
    let matrix1 = new Matrix(2, 3).map((_, row, col) => row + col);
    let matrix2 = new Matrix(3, 4).map((_, row, col) => row + col);
    let result = matrix1.multiply(matrix2);
    html += matrix1.toHTML();
    html += "<div class='operator'>&#x00D7;</div>";
    html += matrix2.toHTML();
    html += "<div class='operator'>=</div>";
    html += result.toHTML();
    html += "</div>";
    document.body.innerHTML = html;
};

window.addEventListener("load", () => {
    update();
});
