'use strict'

function findEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine&&!currCell.isFirstClick) {
                emptyCells.push({ i, j })
            }

        }
    }

    return emptyCells
}

function randMine() {
    var emptyCells = findEmptyCells()
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function randMines(num) {

    for (var i = 0; i < num; i++) {
        var mine = randMine()
        gBoard[mine.i][mine.j].isMine = true
    }
}