type binary = 0 | 1;
type row = Array<binary>;
type rule = (
	b1: binary | undefined,
	b2: binary | undefined,
	b3: binary | undefined
) => binary;

const combine = (
	b1: binary | undefined,
	b2: binary | undefined,
	b3: binary | undefined
) => (b1 << 2) + (b2 << 1) + (b3 << 0);

const getBit = (num: number, pos: number): binary =>
	((num >> pos) & 1) as binary;

function getRule(num: number): rule {
	return (b1, b2, b3) => getBit(num, combine(b1, b2, b3));
}

function drawRule(
	ctx: CanvasRenderingContext2D,
	rule: rule,
	scale: number,
	width: number,
	height: number
) {
	let row = initialRow(width);
	for (let i = 0; i < height; i++) {
		drawRow(ctx, row, scale);
		row = nextRow(row, rule);
	}
}

function initialRow(length: number): row {
	return Array.from(Array(length), _ => Math.floor(Math.random() * 2)) as row;
}

function drawRow(ctx: CanvasRenderingContext2D, row: row, scale: number) {
	ctx.save();
	row.forEach(cell => {
		ctx.fillStyle = cell === 1 ? '#000' : '#fff';
		ctx.fillRect(0, 0, scale, scale);
		ctx.translate(scale, 0);
	});

	ctx.restore();
	ctx.translate(0, scale);
}

function nextRow(row: row, rule: rule): row {
	return row.map((_, i) => rule(row[i - 1], row[i], row[i + 1]));
}

window.onload = function() {
	const width = 1000;
	const height = 500;

	const cellsInRow = 200;
	const cellScale = width / cellsInRow;
	const numberOfRows = height / cellScale;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	document.body.appendChild(canvas);
	let ctx = canvas.getContext('2d');

	const ruleInput = document.getElementById('rule') as HTMLInputElement;
	const runButton = document.getElementById('run');
	const reloadButton = document.getElementById('reload');

	runButton.addEventListener('click', () => {
		let rule = getRule(parseInt(ruleInput.value));
		drawRule(ctx, rule, cellScale, cellsInRow, numberOfRows);
	});

	reloadButton.addEventListener('click', () => {
		window.location.reload();
	});
};
