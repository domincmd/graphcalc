const main = document.querySelector("main")
const expressionAddInput = document.querySelector(".expression-add-input")

function addExpression() {
    if (expressionAddInput.value == "") {
        alert("no fill")
        return;
    }
    expressions.push([expressionAddInput.value, [Math.random() * 255, Math.random() * 255, Math.random() * 255]])
    drawGraph()
}