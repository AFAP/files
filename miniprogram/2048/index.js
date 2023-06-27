import {
  initBoard,
  generateNewBlock,
  handleSwipe,
  isGameOver
} from './gameLogic.js';

Page({
  data: {
    board: [], // 存储游戏方块的二维数组
    score: 0, // 当前得分
    highestScore: 0, // 最高得分
    touchStartX: 0, // 触摸起始点的横坐标
    touchStartY: 0, // 触摸起始点的纵坐标
    touchEndX: 0, // 触摸结束点的横坐标
    touchEndY: 0, // 触摸结束点的纵坐标
  },

  onLoad: function () {
    this.initGame();
  },

  initGame: function () {
    this.initBoard();
    this.generateNewBlock();
  },

  initBoard: function () {
    let board = initBoard();
    this.setData({
      board: board,
    });
  },

  generateNewBlock: function () {
    let board = this.data.board;
    generateNewBlock(board);
    this.setData({
      board: board,
    });
  },

  handleSwipe: function (direction) {
    if (isGameOver(this.data.board)) {
      console.log("结束了");
      wx.showModal({
        title: '提示',
        content: '游戏结束',
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            
          }
        }
      })
      return;
    }
    let board = this.data.board;
    let score = this.data.score;
    let highestScore = this.data.highestScore;
    let result = handleSwipe(board, direction, score, highestScore);
    console.log(result)
    this.setData({
      board: result.board,
      score: result.score,
      highestScore: result.highestScore,
    });
  },

  handleTouchStart: function (event) {
    this.setData({
      touchStartX: event.touches[0].clientX,
      touchStartY: event.touches[0].clientY,
    });
  },

  handleTouchEnd: function (event) {
    this.setData({
      touchEndX: event.changedTouches[0].clientX,
      touchEndY: event.changedTouches[0].clientY,
    });

    const horizontalDistance = this.data.touchEndX - this.data.touchStartX;
    const verticalDistance = this.data.touchEndY - this.data.touchStartY;
    const minDistance = 80; // 最小滑动距离，可根据需要调整

    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      // 水平滑动
      if (Math.abs(horizontalDistance) > minDistance) {
        if (horizontalDistance < 0) {
          this.handleSwipe('left');
        } else {
          this.handleSwipe('right');
        }
      }
    } else {
      // 垂直滑动
      if (Math.abs(verticalDistance) > minDistance) {
        if (verticalDistance < 0) {
          this.handleSwipe('up');
        } else {
          this.handleSwipe('down');
        }
      }
    }
  },
});