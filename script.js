const grid = document.querySelector(".grid");
const screen = document.querySelector("#display");

grid.addEventListener('click', handleClick);

let prevBtn = "clr";	// "num", "op", "cal"

function handleClick(e) {
	if (e.target.localName != "button") return;
	const btn = e.target;
	switch (true) {
		case btn.id == "clr":
			handleClear();
			break;
		case btn.id == "cal":
			handleCal();
			break;
		case btn.id == "bck":
			handleBck();
			break;
		case btn.className == "num":
			handleNum(btn.textContent);
			break;
		case btn.className == "op":
			handleOp(btn.textContent);
			break;
		default:
			break;
	}

}

function disableMulDiv(val) {
	document.querySelector("#mul").disabled = val;
	document.querySelector("#div").disabled = val;
}

function disableAllOps(val) {
	document.querySelectorAll(".op").forEach(o => o.disabled = val);
}

function disableCal(val) {
	document.querySelector("#cal").disabled = val;
}

function handleBck() {
	let expr = screen.textContent;
	let len = expr.length;
	if (expr == "0" || expr == "Infinity" || len == 1) {
		handleClear();
	} else {
		screen.textContent = expr.slice(0, len-1);
		switch (expr.charAt(len-2)) {
			case "*":
			case "/":
			case "+":
			case "-":
				handleOp("");
				break;
			default:
				handleNum("");
				break;
		}
	}
}

function handleClear() {
	screen.textContent = "0";
	disableMulDiv(true);
	disableCal(false);
	prevBtn = "clr";
}

function handleNum(num) {
	if (prevBtn == "clr" || prevBtn == "cal") screen.textContent = "";
	screen.textContent += num;
	disableAllOps(false);
	disableCal(false);
	prevBtn = "num";
}

function handleOp(op) {
	if (prevBtn == "clr" || screen.textContent.search("Infinity") >= 0) {
		screen.textContent = "";
	}
	screen.textContent += op;
	disableAllOps(true);
	disableCal(true);
	prevBtn = "op";
}

function handleCal() {
	let expr = screen.textContent;
	if (expr == "0" || expr.search("Infinity") >= 0) {
		handleClean();
		prevBtn = "cal";
		return;
	}
	prevBtn = "cal";

	// Valid expression, start calculate
	let firstSign = 1;
	if (expr.charAt(0) == "-") {
		firstSign = -1;
		expr = expr.slice(1);
	} else if (expr.charAt(0) == "+") {
		expr = expr.slice(1);
	}
	let opr = expr.split(/[\+\-\*\/]/).map(o => +o);
	opr[0] *= firstSign;
	let oprt = expr.split(/[0-9]/).filter(o => o != "");
	// Mul, div first
	for (let i = 0; i < oprt.length;) {
		if (oprt[i] == "*" || oprt[i] == "/") {
			opr[i] = operate(oprt[i], opr[i], opr[i+1]);
			oprt.splice(i, 1);
			opr.splice(i+1, 1);
		} else {
			++i;
		}
	}
	// Add, sub
	let result =  opr.reduce((re, cur, i) => operate(oprt[i-1], re, cur));
	screen.textContent = result;
}


function operate(op, a, b) {
	let re;
	switch (op) {
		case "*":
			re = a * b;
			break;
		case "/":
			re = a / b;
			break;
		case "+":
			re = a + b;
			break;
		case "-":
			re = a - b;
			break;
		default:
			re = NaN;
	}
	return re;
}

