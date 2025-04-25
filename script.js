// 背景動畫 - 駭客任務代碼雨
const canvas = document.createElement('canvas');
canvas.style.zIndex = '-2'; // 設置 z-index 為 -2
canvas.style.position = 'fixed'; // 固定位置
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none'; // 禁止鼠標事件
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const columns = Math.floor(canvas.width / 20);
const drops = Array(columns).fill(0);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0';
  ctx.font = '20px monospace';

  drops.forEach((y, x) => {
    const text = String.fromCharCode(0x30A0 + Math.random() * 96);  // 隨機生成日文字符
    ctx.fillText(text, x * 20, y * 20);

    if (y * 20 > canvas.height && Math.random() > 0.975) {
      drops[x] = 0;
    }
    drops[x]++;
  });
}

setInterval(drawMatrix, 50);

// 選單顯示與隱藏
const menu = document.getElementById('menu');
document.addEventListener('mousemove', (e) => {
  if (e.clientX < 250) {
    menu.style.left = '0';
  } else {
    menu.style.left = '-250px';
  }
});

// 作品集子選單顯示與隱藏
const portfolio = document.getElementById('portfolio');
const submenu = document.getElementById('submenu');
portfolio.addEventListener('mouseenter', () => {
  submenu.style.display = 'block';
});
portfolio.addEventListener('mouseleave', () => {
  submenu.style.display = 'none';
});

// iframe 顯示與切換
const iframe = document.getElementById('contentFrame');
document.querySelectorAll('#menu li').forEach((item) => {
  item.addEventListener('click', () => {
    const url = item.getAttribute('data-url');
    if (url) {
      iframe.src = url;
      iframe.style.display = 'block';
    } else if (item.id === 'home') {
      iframe.style.display = 'none';
    }
  });
});

const aboutMenuItem = document.getElementById('about');
aboutMenuItem.addEventListener('click', () => {
  // 設置 iframe 顯示自我介紹頁面
  iframe.style.display = 'block';
  iframe.src = 'https://shaun0612.github.io/introduce-myself20250425/';
});

const quizMenuItem = document.getElementById('quiz');
quizMenuItem.addEventListener('click', () => {
  // 設置 iframe 顯示測驗卷頁面
  iframe.style.display = 'block';
  iframe.src = 'https://shaun0612.github.io/introduce-myself20250425/';
});

const tutorialMenuItem = document.getElementById('tutorial');
tutorialMenuItem.addEventListener('click', () => {
  // 設置 iframe 顯示教學影片
  iframe.style.display = 'block';
  iframe.src = 'https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A/week9/20241105_152507.mp4';
});

function windowResized() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 顯示與隱藏角色選單
const toggleCharacterMenu = document.getElementById('toggleCharacter');
toggleCharacterMenu.addEventListener('click', () => {
  isCharacterVisible = !isCharacterVisible;
});
