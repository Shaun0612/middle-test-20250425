let moveImg, stayImg, sleepImg, tapImg;
let x = 0; // 角色的x坐标
let y = 0; // 角色的y坐标
let speed = 2; // 移动速度
let isMoving = false; // 是否在移动
let direction = 'right'; // 角色朝向
let currentState = 'sleep'; // 当前状态：'move', 'stay', 'sleep', 'tap'
let lastMoveTime = 0; // 上次移动的时间
let sleepThreshold = 3000; // 睡眠阈值（3秒）
let tapSound; // 添加点击音效变量
let soundLoaded = false; // 添加音效加载状态变量
let isCharacterVisible = false; // 初始設為隱藏
let toggleButton; // 添加开关按钮变量

let isMouseOverIframe = false; // 標誌：滑鼠是否在 iframe 上

// 角色尺寸设置（像素）
let charWidth = 720;  // 角色宽度
let charHeight = 666; // 角色高度
let scaleFactor = 0.5; // 缩放比例

// 移动状态的动画变量
let moveFrameCount = 0;
let moveAnimationSpeed = 3;
let moveCurrentFrame = 0;
let moveTotalFrames = 25;

// 静止状态的动画变量
let stayFrameCount = 0;
let stayAnimationSpeed = 5;
let stayCurrentFrame = 0;
let stayTotalFrames = 42;

// 睡眠状态的动画变量
let sleepFrameCount = 0;
let sleepAnimationSpeed = 4;
let sleepCurrentFrame = 0;
let sleepTotalFrames = 33;

// 点击状态的动画变量
let tapFrameCount = 0;
let tapAnimationSpeed = 2;
let tapCurrentFrame = 0;
let tapTotalFrames = 43;
let tapDuration = 1410; // 点击状态持续时间（1秒）
let tapStartTime = 0; // 点击开始时间

function preload() {
  // 加载精灵图
  moveImg = loadImage('M3/move.png');
  stayImg = loadImage('M3/stay.png');
  sleepImg = loadImage('M3/sleep.png');
  tapImg = loadImage('M3/tap.png');
  
  // 加载音效并设置回调
  tapSound = loadSound('戳一下.wav', 
    function() {
      soundLoaded = true;
      console.log('音效加载完成');
    },
    function() {
      console.log('音效加载失败');
    }
  );
}

function setup() {
  // 设定窗口大小的画布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('p5Canvas'); // 設置畫布的 ID
  canvas.style('z-index', '3'); // 設置 z-index 為 3
  canvas.style('position', 'fixed'); // 固定位置
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('pointer-events', 'none'); // 禁止鼠標事件，確保不影響其他層

  // 设置图像模式为中心
  imageMode(CENTER);
  // 初始化角色位置靠近左上角
  x = 100; // 初始位置靠近左側
  y = height - charHeight * scaleFactor / 2; // 初始位置靠近下側
  // 初始化上次移动时间
  lastMoveTime = millis();
}

function toggleCharacter() {
  isCharacterVisible = !isCharacterVisible;
}

function isMouseOverCharacter() {
  // 如果角色不可见，返回false
  if (!isCharacterVisible) {
    return false;
  }
  
  // 计算缩放后的显示尺寸
  let displayWidth = charWidth * scaleFactor;
  let displayHeight = charHeight * scaleFactor;
  
  // 计算鼠标到角色的距离
  let dx = mouseX - x;
  let dy = mouseY - y;
  let distance = sqrt(dx * dx + dy * dy);
  
  // 如果距离小于角色尺寸的一半，则认为鼠标在角色上
  return distance < displayWidth/2;
}

function draw() {
  clear(); // 清除畫布，保留透明背景

  // 如果角色不可見或滑鼠在 iframe 上，直接返回
  if (!isCharacterVisible || isMouseOverIframe) {
    return;
  }
  
  // 计算缩放后的显示尺寸
  let displayWidth = charWidth * scaleFactor;
  let displayHeight = charHeight * scaleFactor;
  
  // 检查是否需要切换到睡眠状态
  let currentTime = millis();
  if (currentTime - lastMoveTime > sleepThreshold && currentState !== 'sleep' && currentState !== 'tap') {
    currentState = 'sleep';
  }
  
  // 处理点击状态
  if (currentState === 'tap') {
    if (currentTime - tapStartTime > tapDuration) {
      currentState = 'stay';
      lastMoveTime = currentTime;
    }
  }
  
  // 如果不在睡眠状态且不在点击状态，则处理移动
  if (currentState !== 'sleep' && currentState !== 'tap') {
    let dx = mouseX - x;
    let dy = mouseY - y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      isMoving = true;
      currentState = 'move';
      lastMoveTime = currentTime;
      
      if (dx < 0) {
        direction = 'left';
      } else {
        direction = 'right';
      }
      
      let moveX = (dx / distance) * speed;
      let moveY = (dy / distance) * speed;
      
      x += moveX;
      y += moveY;
    } else {
      isMoving = false;
      currentState = 'stay';
    }
  }
  
  push();
  translate(x, y);
  
  if (currentState === 'move') {
    moveFrameCount++;
    if (moveFrameCount % moveAnimationSpeed === 0) {
      moveCurrentFrame = (moveCurrentFrame + 1) % moveTotalFrames;
    }
    
    let frameWidth = moveImg.width / moveTotalFrames;
    let frameHeight = moveImg.height;
    
    if (direction === 'left') {
      scale(-1, 1);
      image(moveImg, 0, 0, displayWidth, displayHeight, moveCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    } else {
      image(moveImg, 0, 0, displayWidth, displayHeight, moveCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    }
  } else if (currentState === 'stay') {
    stayFrameCount++;
    if (stayFrameCount % stayAnimationSpeed === 0) {
      stayCurrentFrame = (stayCurrentFrame + 1) % stayTotalFrames;
    }
    
    let frameWidth = stayImg.width / stayTotalFrames;
    let frameHeight = stayImg.height;
    
    if (direction === 'left') {
      scale(-1, 1);
      image(stayImg, 0, 0, displayWidth, displayHeight, stayCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    } else {
      image(stayImg, 0, 0, displayWidth, displayHeight, stayCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    }
  } else if (currentState === 'sleep') {
    sleepFrameCount++;
    if (sleepFrameCount % sleepAnimationSpeed === 0) {
      sleepCurrentFrame = (sleepCurrentFrame + 1) % sleepTotalFrames;
    }
    
    let frameWidth = sleepImg.width / sleepTotalFrames;
    let frameHeight = sleepImg.height;
    
    if (direction === 'left') {
      scale(-1, 1);
      image(sleepImg, 0, 0, displayWidth, displayHeight, sleepCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    } else {
      image(sleepImg, 0, 0, displayWidth, displayHeight, sleepCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    }
  } else if (currentState === 'tap') {
    tapFrameCount++;
    if (tapFrameCount % tapAnimationSpeed === 0) {
      tapCurrentFrame = (tapCurrentFrame + 1) % tapTotalFrames;
    }
    
    let frameWidth = tapImg.width / tapTotalFrames;
    let frameHeight = tapImg.height;
    
    if (direction === 'left') {
      scale(-1, 1);
      image(tapImg, 0, 0, displayWidth, displayHeight, tapCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    } else {
      image(tapImg, 0, 0, displayWidth, displayHeight, tapCurrentFrame * frameWidth, 0, frameWidth, frameHeight);
    }
  }
  
  pop();
}

// 点击鼠标处理
function mousePressed() {
  if (isMouseOverCharacter()) {
    if (currentState === 'sleep') {
      // 唤醒角色时先播放点击动画
      currentState = 'tap';
      tapStartTime = millis();
      if (soundLoaded) {
        tapSound.play();
      }
    } else if (currentState !== 'tap') {
      // 切换到点击状态
      currentState = 'tap';
      tapStartTime = millis();
      if (soundLoaded) {
        tapSound.play();
      }
    }
  }
}

