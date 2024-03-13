// all imports
import {
  giveBishopHighlightIds,
  giveRookCapturesIds,
} from "../Helper/commonHelper.js";
import { checkSquareCaptureId } from "../Helper/commonHelper.js";
import { checkPieceOfOpponentOnElement } from "../Helper/commonHelper.js";
import { giveKingCaptureIds } from "../Helper/commonHelper.js";
import { giveQueenCapturesIds } from "../Helper/commonHelper.js";
import { checkWeatherPieceExistsOrNot } from "../Helper/commonHelper.js";
import {
  giveRookHighlightIds,
  giveBishopCaptureIds,
} from "../Helper/commonHelper.js";
import { giveKnightCaptureIds } from "../Helper/commonHelper.js";
import {
  giveKingHighlightIds,
  giveKnightHighlightIds,
} from "../Helper/commonHelper.js";
import { giveQueenHighlightIds } from "../Helper/commonHelper.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { clearhighlight } from "../Render/main.js";
import { selfHighlight } from "../Render/main.js";
import { globalStateRender } from "../Render/main.js";
import { globalState, keySquareMapper } from "../index.js";
import { globalPiece } from "../Render/main.js";
import pawnPromotion from "../Helper/modalCreator.js";

// highlighted cheak and add to this content
let highlight_state = false;
let inTurn = "white";
let whoInCheck = null;

function changeTurn() {
  inTurn = inTurn === "white" ? "black" : "white";
}

function checkForCheck() {
  if (inTurn === "black") {
    const whiteKingcurrentPosition = globalPiece.white_king.current_position;
    const knight_1 = globalPiece.black_knight_1.current_position;
    const knight_2 = globalPiece.black_knight_2.current_position;
    const king = globalPiece.black_king.current_position;
    const bishop_1 = globalPiece.black_bishop_1.current_position;
    const bishop_2 = globalPiece.black_bishop_2.current_position;
    const rook_1 = globalPiece.black_rook_1.current_position;
    const rook_2 = globalPiece.black_rook_2.current_position;
    const queen = globalPiece.black_queen.current_position;

    //push the ids
    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
    finalCheckList.push(giveKingCaptureIds(king, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, inTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === whiteKingcurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "white";
    }
  } else {
    const blackKingcurrentPosition = globalPiece.black_king.current_position;
    const knight_1 = globalPiece.white_knight_1.current_position;
    const knight_2 = globalPiece.white_knight_2.current_position;
    const king = globalPiece.white_king.current_position;
    const bishop_1 = globalPiece.white_bishop_1.current_position;
    const bishop_2 = globalPiece.white_bishop_2.current_position;
    const rook_1 = globalPiece.white_rook_1.current_position;
    const rook_2 = globalPiece.white_rook_2.current_position;
    const queen = globalPiece.white_queen.current_position;

    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
    finalCheckList.push(giveKingCaptureIds(king, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, inTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === blackKingcurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "black";
    }
  }
}

function captureInTurn(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  return;
}

function checkForPawnPromotion(piece, id) {
  if (inTurn === "white") {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("8")
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("1")
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function callbackPawnPromotion(piece, id) {
  const realPiece = piece(id);
  const currentSquare = keySquareMapper[id];
  piece.current_position = id;
  currentSquare.piece = realPiece;
  const image = document.createElement("img");
  image.src = realPiece.img;
  image.classList.add("piece");

  const currentElement = document.getElementById(id);
  currentElement.innerHTML = "";
  currentElement.append(image);
}

// move elements
function moveElement(piece, id) {
  const pawnIsPromoted = checkForPawnPromotion(piece, id);

  const flatData = globalState.flat();
  flatData.forEach((el) => {
    if (el.id == piece.current_position) {
      delete el.piece;
    }
    if (el.id == id) {
      if (el.piece) {
        el.piece.current_position = null;
      }
      el.piece = piece;
    }
  });
  clearhighlight();
  const previousPiece = document.getElementById(piece.current_position);
  piece.current_position = null;
  previousPiece?.classList?.remove("highlightYellow");
  const currentPiece = document.getElementById(id);
  currentPiece.innerHTML = previousPiece?.innerHTML;
  if (previousPiece) previousPiece.innerHTML = "";
  piece.current_position = id;
  if (pawnIsPromoted) {
    pawnPromotion(inTurn, callbackPawnPromotion, id);
  }
  checkForCheck();
  changeTurn();
}

// current selfhighlighted
let selfHighlightState = null;

let moveState = null;

// localself highlight for clear previous highlights
function clearHighlightLocal() {
  clearhighlight();
  highlight_state = false;
}

// move x to y
function movePieceFromXToY(from, to) {
  to.piece = from.piece;
  from.piece = null;
  globalStateRender();
}

// white-pawn 
function whitePawnClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights on click on other box
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();
  // highlighting 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece 
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();
  let highlightSquareIds = null;

  if (current_pos[1] == "2") {
    highlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) + 1}`,
      `${current_pos[0]}${Number(current_pos[1]) + 2}`,
    ];
  } else {
    highlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) + 1}`];
  }

  highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  // capture id logic
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${Number(current_pos[1]) + 1
    }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${Number(current_pos[1]) + 1
    }`;

  let captureIds = [col1, col2];

  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

// white bishop event
function whiteBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const { bottomLeft, topLeft, bottomRight, topRight } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// black bishop event
function blackBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const { bottomLeft, topLeft, bottomRight, topRight } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];
  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];
    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];
      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }
      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

// black rook
function blackRookClick(square) {
  const piece = square.piece;
  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveRookHighlightIds(current_pos);
  let temp = [];

  const { bottom, top, right, left } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

// white rook click
function whiteRookClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveRookHighlightIds(current_pos);
  let temp = [];

  const { bottom, top, right, left } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  globalStateRender();
}

// handle knight click
function whiteKnightClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveKnightHighlightIds(current_pos);
  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  highlightSquareIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

// handle knight click
function blackKnightClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveKnightHighlightIds(current_pos);

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  highlightSquareIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}

// white queen event
function whiteQueenClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveQueenHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }


  globalStateRender();
}

// white king event
function whiteKingClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveKingHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  globalStateRender();
}
// white king event
function blackKingClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;

  let highlightSquareIds = giveKingHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // highlightSquareIds = checkSquareCaptureId(highlightSquareIds);
  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

// black queen event
function blackQueenClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }
  // clear highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();
  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = giveQueenHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = highlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);



  highlightSquareIds = result.flat();

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];


      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (

        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }



      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }
  globalStateRender();
}

// black pawn function
function blackPawnClick(square) {
  // clear board for any previous highlight

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlight 
  selfHighlight(piece);
  highlight_state = true;
  selfHighlightState = piece;

  // add piece
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let highlightSquareIds = null;

  // on initial position movement
  if (current_pos[1] == "7") {
    highlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) - 1}`,
      `${current_pos[0]}${Number(current_pos[1]) - 2}`,
    ];
  } else {
    highlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) - 1}`];
  }

  highlightSquareIds = checkSquareCaptureId(highlightSquareIds);

  highlightSquareIds.forEach((highlight) => {
    const element = keySquareMapper[highlight];
    element.highlight = true;
  });

  // capture logic id
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${Number(current_pos[1]) - 1
    }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${Number(current_pos[1]) - 1
    }`;

  let captureIds = [col1, col2];
  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}

function clearPreviousSelfHighlight(piece) {
  if (piece) {
    document
      .getElementById(piece.current_position)
      .classList.remove("highlightYellow");
    selfHighlightState = null;
  }
}

// black pawn event

function GlobalEvent() {
  ROOT_DIV.addEventListener("click", function (event) {
    if (event.target.localName === "img") {
      const clickId = event.target.parentNode.id;

      const square = keySquareMapper[clickId];

      if (
        (square.piece.piece_name.includes("WHITE") && inTurn === "black") ||
        (square.piece.piece_name.includes("BLACK") && inTurn === "white")
      ) {
        captureInTurn(square);
        return;
      }

      if (square.piece.piece_name == "WHITE_PAWN") {
        if (inTurn == "white") whitePawnClick(square);
      } else if (square.piece.piece_name == "BLACK_PAWN") {
        if (inTurn == "black") blackPawnClick(square);
      } else if (square.piece.piece_name == "WHITE_BISHOP") {
        if (inTurn == "white") whiteBishopClick(square);
      } else if (square.piece.piece_name == "BLACK_BISHOP") {
        if (inTurn == "black") blackBishopClick(square);
      }
      else if (square.piece.piece_name == "BLACK_ROOK") {
        if (inTurn == "black") blackRookClick(square);
      } else if (square.piece.piece_name == "WHITE_ROOK") {
        if (inTurn == "white") whiteRookClick(square);
      }
      else if (square.piece.piece_name == "WHITE_KNIGHT") {
        if (inTurn == "white") whiteKnightClick(square);
      } else if (square.piece.piece_name == "BLACK_KNIGHT") {
        if (inTurn == "black") blackKnightClick(square);
      } else if (square.piece.piece_name == "WHITE_QUEEN") {
        if (inTurn == "white") whiteQueenClick(square);
      } else if (square.piece.piece_name == "BLACK_QUEEN") {
        if (inTurn == "black") blackQueenClick(square);
      } else if (square.piece.piece_name == "WHITE_KING") {
        if (inTurn == "white") whiteKingClick(square);
      } else if (square.piece.piece_name == "BLACK_KING") {
        if (inTurn == "black") blackKingClick(square);
      }
    } else {
      const childElementsOfclickedEl = Array.from(event.target.childNodes);

      if (
        childElementsOfclickedEl.length == 1 ||
        event.target.localName == "span"
      ) {
        if (event.target.localName == "span") {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.parentNode.id;
          moveElement(moveState, id);
          moveState = null;
        } else {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.id;
          moveElement(moveState, id);
          moveState = null;
        }
      } else {
        // clear highlights
        clearHighlightLocal();
        clearPreviousSelfHighlight(selfHighlightState);
      }
    }
  });
}

export { GlobalEvent, movePieceFromXToY };
