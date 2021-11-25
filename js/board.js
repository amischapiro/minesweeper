'use strict'




function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()

        }
    }
    return board;

}

function setMines() {
    randMines(gLevel.mines)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) setMinesNegCount({ i, j })
        }
    }
}


function createCell() {
    var cell = {
        minesAround: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isFirstClick: false
    }
    return cell
}



function renderBoard(board) {
    var strHTML = ''
    // console.table(board);
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = (board[i][j].isMine) ? MINE : ''

            var className = (cell === MINE) ? 'mine' : ''
            strHTML += `
            <td id="cell-${i}-${j}" oncontextmenu="return false" onmousedown="mouseDown(event,this,${i},${j})" class="${className}">
              <span> ${cell} </span> 
            </td>
            `
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

