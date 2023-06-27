// 初始化游戏方块
export function initBoard() {
  console.log('-->initBoard')
  let board = [];
  for (let i = 0; i < 4; i++) {
    board[i] = [];
    for (let j = 0; j < 4; j++) {
      board[i][j] = 0; // 初始值为0表示空方块
    }
  }
  return board;
}

// 生成新的方块
export function generateNewBlock(board) {
  console.log("-->generateNewBlock")
  const availablePositions = []; // 可用位置的数组

  // 找出空方块的位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        availablePositions.push({
          row: i,
          col: j
        });
      }
    }
  }

  // 在空方块中随机选择一个位置生成新的方块（值为2或4）
  if (availablePositions.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const randomPosition = availablePositions[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    board[randomPosition.row][randomPosition.col] = newValue;
  }
}

// 判断游戏是否结束
export function isGameOver(board) {
  // 检查是否存在空方块
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  // 检查水平方向是否存在相邻相同数字的方块
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  // 检查垂直方向是否存在相邻相同数字的方块
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

// 处理滑动操作
export function handleSwipe(board, direction, score, highestScore) {
  console.log("-->handleSwipe", direction)
  let newBoard = cloneBoard(board); // 克隆一份当前方块数组，用于操作和计算
  let scoreObj = {score}; // 新的得分
  let newHighestScore = highestScore; // 新的最高得分

  switch (direction) {
    case 'left':
      for (let i = 0; i < 4; i++) {
        newBoard[i] = mergeRowLeft(newBoard[i], scoreObj);
      }
      break;
    case 'right':
      for (let i = 0; i < 4; i++) {
        newBoard[i] = mergeRowRight(newBoard[i], scoreObj);
      }
      break;
    case 'up':
      newBoard = transposeBoard(newBoard);
      for (let i = 0; i < 4; i++) {
        newBoard[i] = mergeRowLeft(newBoard[i], scoreObj);
      }
      newBoard = transposeBoard(newBoard);
      break;
    case 'down':
      newBoard = transposeBoard(newBoard);
      for (let i = 0; i < 4; i++) {
        newBoard[i] = mergeRowRight(newBoard[i], scoreObj);
      }
      newBoard = transposeBoard(newBoard);
      break;
    default:
      break;
  }

  if (scoreObj.score > newHighestScore) {
    newHighestScore = scoreObj.score;
  }

  generateNewBlock(newBoard);

  return {
    board: newBoard,
    score: scoreObj.score,
    highestScore: newHighestScore,
  };
}

// 合并一行方块（向左移动）
function mergeRowLeft(row, scoreObj) {
  let mergedRow = compressRow(row);
  mergedRow = mergeTiles(mergedRow, scoreObj);
  mergedRow = compressRow(mergedRow);
  return mergedRow;
}

// 合并一行方块（向右移动）
function mergeRowRight(row, scoreObj) {
  row.reverse();
  row = mergeRowLeft(row, scoreObj);
  row.reverse();
  return row;
}

// 压缩一行方块（将非零方块移到一侧）
function compressRow(row) {
  let compressedRow = [];
  for (let i = 0; i < 4; i++) {
    if (row[i] !== 0) {
      compressedRow.push(row[i]);
    }
  }
  while (compressedRow.length < 4) {
    compressedRow.push(0);
  }
  return compressedRow;
}

// 合并相邻的方块（计算得分）
function mergeTiles(row, scoreObj) {
  for (let i = 0; i < 3; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      const mergedValue = row[i] * 2;
      row[i] = mergedValue;
      row[i + 1] = 0;
      scoreObj.score += mergedValue;
    }
  }
  return row;
}

// 转置方块数组
function transposeBoard(board) {
  const transposedBoard = [];
  for (let i = 0; i < 4; i++) {
    transposedBoard[i] = [];
    for (let j = 0; j < 4; j++) {
      transposedBoard[i][j] = board[j][i];
    }
  }
  return transposedBoard;
}

// 克隆方块数组
function cloneBoard(board) {
  const clonedBoard = [];
  for (let i = 0; i < 4; i++) {
    clonedBoard[i] = [];
    for (let j = 0; j < 4; j++) {
      clonedBoard[i][j] = board[i][j];
    }
  }
  return clonedBoard;
}