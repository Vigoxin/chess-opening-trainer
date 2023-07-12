var orientation = "white";
var currentNode;
var	rootNode = new TreeNode("root");
var allSequences = [];
var randomSequenceIndex;
var currentSequence;

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

$("#starting-position").on("click", function(){
	initialiseChessBoard();
})

$("#show-answer").on("click", function(){
	toShow = currentNode.children.map(x => x.contents);
	alert(`Moves in your repertoire are:\n${"\n- "+ toShow.join("\n- ")}`);
})

document.addEventListener('keydown', (event) => {
	var name = event.key;
	var code = event.code;
	if (code === "ArrowLeft" && positionStackIndex > 0) {
		undo();
	}

}, false);

function importPGN(pgn) {
	pgn = pgn.replace(/\{[^}]*\}/g, "");
	pgn = pgn.replace(/\s+/g, ' ').trim();
	var stack = [];
	currentNode = rootNode;
	pgn = pgn.replace(/\[.*\]/g, "");
	pgn = pgn.replace("*", "");
	pgn = pgn.trim();
	if (pgn === "") {
		alert("Unsuccessful import - PGN empty");
		return;
	}
	pgn = pgn.split(" ");
	
	// console.log(pgn.join("\n"));

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



	depthFirstStack = [];
	currentSequence = [];
	// Start by putting any one of the graph's vertices on top of a stack.
	depthFirstStack.push(currentNode);
	currentSequence.push(currentNode);
	depthFirstVisited = [];
	while (depthFirstStack.length !== 0) {
		// Take the top node of the stack
		nextNode = depthFirstStack.pop();
		// "Visit" this node this consists of adding its move into the current sequence
			if (nextNode.idd > 0) {
				// Remove all nodes at end of current sequence until the parent of nextNode is the last node in the sequence
				while (currentSequence.slice(-1)[0].idd !== nextNode.parent.idd) {
					currentSequence.pop();
				}
				currentSequence.push(nextNode);
			}
		// If visited node was a leaf node, add a copy of currentSequence into allSequences
		if (nextNode.children.length === 0) {
			allSequences.push(currentSequence.slice(1,currentSequence.length));
		}
		//  Add visited node to the visited list.
		depthFirstVisited.push(nextNode.idd);
		// Create a list of that vertex's adjacent nodes. Add the ones which aren't in the visited list to the top of the stack.
		for (let node of nextNode.children) {
			if (!depthFirstVisited.includes(node.idd)) {
				depthFirstStack.push(node);
			}
		}
	}



	currentNode = rootNode;
	alert("PGN successfully imported");
	initialiseChessBoard();

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