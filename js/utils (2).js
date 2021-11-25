



function copyMat(mat) {
  var newMat=[]
  for(vari=0;i<mat.length;i++) {
    newMat[i]=[]
    for(var j=0;j<mat.length;j++) {
      newMat[i][j]=mat[i][j]  
    }
  }
  return newMat
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function toggleGame(elBtn) {
  if (gGameInterval) {
      clearInterval(gGameInterval);
      gGameInterval = null;
      elBtn.innerText = 'Play';
  } else {
      gGameInterval = setInterval(play, GAME_FREQ);
      elBtn.innerText = 'Pause';

  }
}

function countNegs(cellI, cellJ, mat) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i > mat.length - 1) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
          if (j < 0 || j > mat[i].length - 1) continue;
          if (i === cellI && j === cellJ) continue;
        
          if (mat[i][j]) negsCount++;// might need a change
      }
  }
  return negsCount;
}


function playSound(file) {
  var audio = new Audio(file)
  audio.play()
}

function drawNum() {
  var idx = getRandomInt(0, gNums.length)
  var num = gNums[idx]
  gNums.splice(idx, 1)
  return num
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// printPrimaryDiagonal(mat)

function printPrimaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
      var item = squareMat[d][d];
      console.log(item);
  }
}


// printSecondaryDiagonal(mat)

function printSecondaryDiagonal(squareMat) {
  for (var d = 0; d < squareMat.length; d++) {
      var item = squareMat[d][squareMat.length - 1 - d];
      console.log(item);
  }
}


function shuffle(items) {
  var randIdx, keep;
  for (var i = items.length - 1; i > 0; i--) {
      // randIdx = getRandomInt(0, items.length);
      randIdx = getRandomInt(0, i + 1);

      keep = items[i];
      items[i] = items[randIdx];
      items[randIdx] = keep;
  }
  return items;
}

function renderCell(cellI, cellJ, value) {
  var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
  console.log('elCell:', elCell);
  elCell.innerText = value
  elCell.classList.remove('occupied')

}

function getAvailablePositions(pos) {
  var positions = []
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
      if (i < 0 || i >= gCinema.length) continue;
      for (var j = pos.j - 1; j <= pos.j + 1; j++) {
          if (j < 0 || j >= gCinema[i].length) continue;
          if (i === pos.i && j === pos.j) continue;
          if (gCinema[i][j].isSeat && !gCinema[i][j].isBooked) seats.push({i:i, j:j})
      }
  }
  return positions;
}


// function displayTimer() {
//   var startTime = Date.now();
//   var elTimer = document.querySelector('.timer');

//   gTimerIntervalId = setInterval(() => {
//       elTimer.innerText = ((Date.now() - startTime) / 1000).toFixed(2)
//   }, 10)
//   elTimer.style.display = 'block';
// }
///// start by calling displayTimer(), end by clearInterval
///// gIntervalId
///// DOM =  <div class="timer"><h2></h2></div>