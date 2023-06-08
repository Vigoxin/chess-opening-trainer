var intervalID;
var playingBlack = false;

// var samePageNavButton = $(`a[href="/${window.location.href.split("/").slice(-1)[0]}"]>button`);
// samePageNavButton.addClass("prominent-button");
// samePageNavButton.attr("disabled", true);

function initialiseChessBoard() {
	squaresToHighlight = [];
	positionStack = [{
			"position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			"squaresToHighlight": []
	}];
	positionStackIndex = 0;

	$(".undo-redo-button").addClass("invisible", true);
	$("#flip-board").removeClass("invisible", false);

	board = Chessboard('board', {
		draggable: true,
		position: "start",
		orientation: playingBlack ? "black" : "white",
		moveSpeed: 200,
		onDrop: onDrop,
		onDragStart: onDragStart,
		onSnapEnd: onSnapEnd,
		onSnapbackEnd
	})
	game = new Chess();

	currentNode = rootNode;

	if (playingBlack) {
		playNextMove();
	}
}

function makeFirstMove() {
	movePiece(chessboardDict["first_move"], chessboardDict["pos_after_first_move"]);
	positionStack[1] = {
		"pos": game.fen(),
		"squaresToHighlight": squaresToHighlight
	}
}

function manageStack() {
	if (positionStackIndex === positionStack.length-1) {
		positionStack.push({
			"position": game.fen(),
			"squaresToHighlight": squaresToHighlight
		});
		positionStackIndex++;
	} else if (positionStack[positionStackIndex+1]["position"] === game.fen()) {
		positionStackIndex++;
	} else {
		positionStack = positionStack.slice(0, positionStackIndex+1);
		positionStack.push({
			"position": game.fen(),
			"squaresToHighlight": squaresToHighlight
		});
		positionStackIndex++;
	}

	if (positionStackIndex === positionStack.length-1) {
		$(".redo-button").addClass("invisible");
	}
	$(".undo-button").removeClass("invisible");
	
	if ((!playingBlack && positionStackIndex > 0) || (playingBlack && positionStackIndex > 1)) {
		$("#flip-board").addClass("invisible");
	}

}

function undo() {
	game.undo();
	board.position(game.fen());
	currentNode = currentNode.parent;
	
	positionStackIndex--;

	if (positionStackIndex === 0) {
		$(".undo-button").addClass("invisible");
		$("#flip-board").removeClass("invisible");

		if (playingBlack) {
			playNextMove();
		}
	}
	// $(".redo-button").removeClass("invisible");

	if ((!playingBlack && game.turn() === "b") || (playingBlack && game.turn() === "w")) {
		undo();
	}

}

// function redo() {
// 	board.position(positionStack[positionStackIndex+1]["position"]);
// 	game.load(positionStack[positionStackIndex+1]["position"]);

// 	squaresToHighlight = positionStack[positionStackIndex+1]["squaresToHighlight"];
// 	highlightSquaresToHighlight();

// 	positionStackIndex++;


// 	if (positionStackIndex === positionStack.length-1) {
// 		$(".redo-button").addClass("invisible");
// 	}
// 	$(".undo-button").removeClass("invisible");


// }

$(".undo-button").on("click", undo);
// $(".redo-button").on("click", redo);

function onDragStart(source, piece, position, orientation) {
	// do not pick up pieces if the game is over
	// if (game.game_over()) return false

	// only pick up pieces for the side to move
	if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
		return false
	}
	dehighlightAllSquares("#board");
}

function onDrop(source, target, piece) {
	// see if the move is legal
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for simplicity
	})
	// illegal move
	if (move === null) {return 'snapback'}

	if (source === target) {
		highlightSquaresToHighlight();
	} else {
		squaresToHighlight = [source, target];
		highlightSquaresToHighlight();
	}

}

function playNextMove () {
	console.log(currentNode);
	randomChildNode = currentNode.children[Math.floor(Math.random()*currentNode.children.length)];
	currentNode = randomChildNode;
	randomMove = randomChildNode.contents;

	game.move(randomMove);
	board.position(game.fen());
	manageStack();

	console.log(currentNode);
	console.log("move on");
}

function onSnapEnd () {
	// board.position(game.fen());
	console.log("Asdf");
	manageStack();

	if (currentNode.children.length === 0) {
		setTimeout(function(){
			alert("No more repertoire left")
			initialiseChessBoard();
			// undo();
		}, 100);
		return;
	}

	lastMove = game.history().slice(-1)[0];
	if (currentNode.children.map(x => x.contents).includes(lastMove)) {
		currentNode = currentNode.children.filter(x => x.contents === lastMove)[0];
		
		if (currentNode.children.length === 0) {
			setTimeout(function(){
				alert("No more repertoire left")
				// initialiseChessBoard();
				undo();
			}, 100);
			return;
		}

		playNextMove();

	} else {
		setTimeout(function(){
			alert("That move is not in your repertoire!")
			currentNode = currentNode.children[0];
			undo();
		}, 100);
	}
}

function onSnapbackEnd() {
	highlightSquaresToHighlight();
}

function highlightSquaresToHighlight() {
	// dehighlightAllSquares("#board");
	// for (let square of squaresToHighlight) {
	// 	highlightSquare("#board", square);
	// }
}

function highlightSquare(board, square) {
	$(board).find('.square-' + square).addClass('highlight-square');
}

function dehighlightSquare(board, square) {
	$(board).find('.square-' + square).removeClass('highlight-square');
}

function dehighlightAllSquares(board) {
	$(board).find(".row-5277c>*").removeClass("highlight-square");
}

function movePiece(moveString, fenAfterMove) {
	var initialPosition = game.fen();

	moveString = moveString.slice(0, 5);
	var source = moveString.split("-")[0];
	var target = moveString.split("-")[1];

	board.move(moveString);
	setTimeout(function(){
		board.position(fenAfterMove);
		game.load(fenAfterMove);
		manageStack();
	}, 400);

	squaresToHighlight = [source, target];
	highlightSquaresToHighlight();
}

function setIntervalX(callback, delay, repetitions) {
		var x = 0;
		intervalID = window.setInterval(function () {

			 callback();

			 if (++x === repetitions) {
					 window.clearInterval(intervalID);
			 }
		}, delay);
}