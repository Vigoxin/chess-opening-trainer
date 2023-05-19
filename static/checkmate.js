var orientation = "white";
var	rootNode = new TreeNode("root");

$(document).ready(function(){
	nextQuestion();
});

function updatePageToQuestion() {
	initialiseChessBoard();
}

function nextQuestion() {
	updatePageToQuestion();
}

$("#import-pgn").on("click", function(){
	importPGN($("#pgn-text-area").val());
})

$("#flip-board").on("click", function(){
	flipBoard();
})

document.addEventListener('keydown', (event) => {
	var name = event.key;
	var code = event.code;
	if (code === "ArrowLeft" && positionStackIndex > 0) {
		undo();
	}

}, false);

function importPGN(pgn) {
	pgn = pgn.replace(/\s+/g, ' ').trim();
	stack = [];
	var currentNode = rootNode;
	pgn = pgn.split(" ");
	for (let move of pgn) {
		components = move.split(/(?=[\(\)])|(?<=[\(\)])/g);
		for (let c of components) {
			if (c.match(/^\d{1,2}\.$/) || c.match(/^\d{1,2}\.{1,3}$/)) {
				continue;
			}
			// console.log(c);
			if (c === "(") {
				// console.log(`( so adding current node ${currentNode.contents} to stack and making currentNode the parent`);
				stack.push(currentNode);
				currentNode = currentNode.parent;
			} else if (c === ")") {
				currentNode = stack.pop();
				// console.log(`) so popping ${currentNode.contents} from stack and making it currentNode`);
			} else {
				// console.log(`normal so adding ${c} as child to ${currentNode.contents}`);
				toAdd = new TreeNode(c);
				currentNode.add(toAdd);
				currentNode = toAdd;
			}
			// console.log("current node = " + currentNode.contents);
			// console.log("\n");
		}
	}
	currentNode = rootNode;
	alert("PGN successfully imported");

	if (playingBlack) {
		playNextMove();
	}
}

function flipBoard() {
	playingBlack = !playingBlack;
	board.flip();
	while (positionStackIndex !== 0) {
		undo();
	}
	if (playingBlack) {
		playNextMove();
	}
}