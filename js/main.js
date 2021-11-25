'use strict'

const MINE = '💣'
const MARKED = '🚩'

var gBoard
var gLives = 3
var gTimerIntervalId
var gClickCount = 0
var gSafeClicks = 3
var gHighScoreB
var gHighScoreA
var gHighScoreE
var gHints = 0
var gHintClick
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesShown: 0,
    isHintMode: false
}



function init() {
    gBoard = createBoard(gLevel.size)
    renderBoard(gBoard)
    clearInterval(gTimerIntervalId)
    gGame.isOn = true
    gGame.minesShown = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gSafeClicks = 3
    gHintClick = 0
    gHints = 0
    gLives = 3
    gClickCount = 0
    updateLives()
    smileyStatus('happy')
    displaySafeClicksNum()
    updateHintNum()

}


function setMinesNegCount(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === pos.i && j === pos.j) continue;
            gBoard[i][j].minesAround++

        }
    }

}

function rightButtonClicked(e) {
    var rightClick = false;
    e = e || window.event;
    if (e.which) {
        rightClick = (e.which === 3)
    } else if (e.button) {
        rightClick = (e.button === 2)
    }
    return rightClick

}

function mouseDown(e, elCell, i, j) {
    if (gBoard[i][j].isShown) return
    if (!gGame.isOn) return
    gClickCount++

    if (gClickCount === 1) {
        gGame.isOn = true
        gTimerIntervalId = setInterval(timer, 1000)
        gBoard[i][j].isFirstClick = true
        setMines()
    }
    if(gClickCount===gHintClick){
        gGame.isHintMode = true
        revealHintCells(i,j)
        setTimeout(hideHintCells,500,i,j)
    }

    if (rightButtonClicked(e)) {
        if (!gBoard[i][j].isMarked) {
            markCell(elCell, i, j)

            return
        } else {
            unMarkCell(elCell, i, j)
            return
        }

    } else {
        leftButtonClicked(elCell, i, j)

    }

    checkGameOver()
}


function leftButtonClicked(elCell, i, j) {
    if (gGame.isHintMode || gBoard[i][j].isMarked) return
    elCell.style.backgroundColor = 'white'
    var elSpan = elCell.querySelector('span')
    // elSpan.style.display = 'block'
    gBoard[i][j].isShown = true
    if (!gBoard[i][j].isMine) {
        displayNumCell(elCell, i, j)


    } else {
        mineClicked(elCell)

    }
}

function mineClicked(elCell) {
    elCell.innerText = MINE
    gLives--
    elCell.style.backgroundColor = 'red'
    elCell.style.borderColor = 'red'
    updateLives()
    var audio = new Audio('smallExplosion.wav')
    audio.play()
    gGame.minesShown++
    if (gLives === 0) {
        var allMines = revealMines()
        for (var k = 0; k < allMines.length; k++) {
            var elMine = document.getElementById(`cell-${allMines[k].i}-${allMines[k].j}`)
            elMine.style.backgroundColor = 'white'
            elMine.style.borderColor = 'white'
            elMine.innerText = MINE
        }
        clearInterval(gTimerIntervalId)
        smileyStatus('sad')
        gGame.isOn = false
    }

}

function markCell(elCell, i, j) {
    var elSpan = elCell.querySelector('span')
    gBoard[i][j].isMarked = true
    elSpan.innerText = MARKED
    elSpan.style.display = 'block'
    elCell.classList.add('marked')
    gGame.markedCount++
    if (gBoard[i][j].isMine) gGame.minesShown++
    checkGameOver()

}

function unMarkCell(elCell, i, j) {
    var elSpan = elCell.querySelector('span')
    if (gBoard[i][j].isMine) {
        elSpan.innerText = MINE
        gGame.minesShown--
    } else {
        elSpan.innerText = gBoard[i][j].minesAround
    }
    elSpan.style.display = 'none'
    gBoard[i][j].isMarked = false
    elCell.classList.remove('marked')
}



function updateLives() {
    var elNumLives = document.querySelector('.lives span')
    if (gLives === 3) elNumLives.innerText = '❤❤❤'
    if (gLives === 2) elNumLives.innerText = '❤❤'
    if (gLives === 1) elNumLives.innerText = '❤'
    if (gLives === 0) elNumLives.innerText = ''
}


function smileyStatus(status) {
    var elSmiley = document.querySelector('.smiley')
    if (status === 'happy') elSmiley.innerText = '😁'
    if (status === 'sad') elSmiley.innerText = '😢'
    if (status === 'win') elSmiley.innerText = '😎'


}

function setLevel(size, mines) {
    gLevel.size = size
    gLevel.mines = mines
    init()
}

function checkGameOver() {
    var cells = gLevel.size ** 2
    
    if (gGame.shownCount + gGame.minesShown === cells) gameWon()
}

function gameWon() {
    gGame.isOn = false
    clearInterval(gTimerIntervalId)
    var audio = new Audio('crowd.mp3')
    audio.play()
    var score = gGame.secsPassed
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `Score: ${score}`
    var elHighScoreB = document.querySelector('.high-score .beginner-score')
    var elHighScoreA = document.querySelector('.high-score .advanced-score')
    var elHighScoreE = document.querySelector('.high-score .expert-score')
    if(gLevel.size ===4){
        if(!gHighScoreB||score<gHighScoreB){
            gHighScoreB = score
            elHighScoreB.innerText = gHighScoreB
        }
    }
    if(gLevel.size ===8){
        if(!gHighScoreA||score<gHighScoreA){
            gHighScoreA = score
            elHighScoreA.innerText = gHighScoreA
        }
    }
    if(gLevel.size ===12){
        if(!gHighScoreE||score<gHighScoreE){
            gHighScoreE = score
            elHighScoreE.innerText = gHighScoreE
        }
    }
    smileyStatus('win')

}

function displayNumCell(elCell, i, j) {
    var negNum = gBoard[i][j].minesAround
    // var elSpan = elCell.querySelector('span')
    elCell.innerText = (negNum) ? negNum : ''
    elCell.style.fontWeight = 'bolder'
    elCell.style.borderColor = 'white'
    if (negNum === 1) elCell.style.color = 'blue'
    if (negNum === 2) elCell.style.color = 'green'
    if (negNum === 3) elCell.style.color = 'red'
    gGame.shownCount++
    var neighbors = checkNeighbors({ i, j })
    if (neighbors) {
        for (var k = 0; k < neighbors.length; k++) {
            var elCurrCell = document.getElementById(`cell-${neighbors[k].i}-${neighbors[k].j}`)
            elCurrCell.style.backgroundColor = 'white'
            elCurrCell.style.borderColor = 'white'
            // var elCurrSpan = elCurrCell.querySelector('span')
            gBoard[neighbors[k].i][neighbors[k].j].isShown = true
            var negNum2 = gBoard[neighbors[k].i][neighbors[k].j].minesAround
            elCurrCell.innerText = (negNum2) ? negNum2 : ''
            elCurrCell.style.fontWeight = 'bolder'
            if (negNum2 === 1) elCurrCell.style.color = 'blue'
            if (negNum2 === 2) elCurrCell.style.color = 'green'
            if (negNum2 === 3) elCurrCell.style.color = 'red'
            gGame.shownCount++
        }
    }
}

function checkNeighbors(pos) {
    var neighbors = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            var currCell = gBoard[i][j]
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (currCell.isMine) return null
            if (currCell.isShown) continue
            neighbors.push({ i, j })
        }
    }

    return neighbors
}

function getHint(){
    gHintClick = gClickCount +1
    gHints++
    updateHintNum()

}

function updateHintNum(){
    var elBtn = document.querySelector('.hint')
    for(var i = 1;i<=3;i++){
        if (gHints===i){
            var elCurrBulb = elBtn.querySelector(`.bulb${i}`)
            elCurrBulb.style.fontWeight = 'bolder'
        } else if(!gHints) {
            var elCurrBulb = elBtn.querySelector(`.bulb${i}`)
            elCurrBulb.style.fontWeight = 'normal'

        }
    }

}


function revealMines() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isShown) {
                mines.push({ i, j })
            }
        }
    }
    return mines
}

function timer() {
    gGame.secsPassed++
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gGame.secsPassed

}

function customLevel() {
    var size = +prompt('What size would you like your board to be?')
    var mines = +prompt('How many mines should be on the board?')
    if (mines > size ** 2) {
        alert('Too many mines!')
    } else if (size < 2) {
        alert('Size too small!')
    } else if (size > 14) {
        alert('Size too big!')
    } else {
        setLevel(size, mines)
    }
}


function hintNeighbors(pos){
    var neighbors = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            var currCell = gBoard[i][j]
            if (j < 0 || j >= gBoard[0].length) continue;
            if (currCell.isShown) continue
            neighbors.push({ i, j })
        }
    }
    return neighbors
}

function revealHintCells(i,j){
    var cellsToReveal = hintNeighbors({i,j})
    
    for(var k = 0;k<cellsToReveal.length;k++){
        var currCell = cellsToReveal[k]
        var elCell = document.getElementById(`cell-${currCell.i}-${currCell.j}`)
        elCell.style.backgroundColor = 'white'
        var elSpan = elCell.querySelector('span')
        var negNum = gBoard[currCell.i][currCell.j].minesAround
        if (gBoard[currCell.i][currCell.j].isMine){
            elSpan.innerText = MINE
            elSpan.style.display = 'block'
        } else if (negNum){
            elSpan.innerText = negNum
            elSpan.style.display = 'block'
        } 
    }
}

function hideHintCells(i,j){
    var cellsToHide = hintNeighbors({i,j})
    
    for(var k = 0;k<cellsToHide.length;k++){
        var currCell = cellsToHide[k]
        var elCell = document.getElementById(`cell-${currCell.i}-${currCell.j}`)
        elCell.style.backgroundColor = 'gray'
        var elSpan = elCell.querySelector('span')
        elSpan.style.display = 'none'
         
    }
    gGame.isHintMode = false

}

function safeClick(elBtn) {
    if (!gClickCount) return
    if (!gSafeClicks) return
    gSafeClicks--
    displaySafeClicksNum()
    var emptyCells = findSafeCells()
    var randIdx = getRandomInt(0, emptyCells.length)
    var safeCell = emptyCells[randIdx]
    var elCell = document.getElementById(`cell-${safeCell.i}-${safeCell.j}`)
    displayNumCell(elCell, safeCell.i, safeCell.j)
    elCell.style.backgroundColor = 'white'



}

function displaySafeClicksNum() {
    var clicksLeft = document.querySelector('.num-safe')
    clicksLeft.innerText = gSafeClicks
}

function findSafeCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                emptyCells.push({ i, j })
            }

        }
    }

    return emptyCells
}