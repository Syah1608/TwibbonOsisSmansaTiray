const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadButton = document.getElementById('download-btn');
const fileNameDisplay = document.getElementById('file-name');
const frameImg = new Image();
frameImg.src = 'twibbon_mpls.png';

let userImage = new Image();
let userImageLoaded = false;

let offsetX = 0;
let offsetY = 0;
let drawWidth = canvas.width;
let drawHeight = canvas.height;
let zoomFactor = 1;

const zoomSlider = document.getElementById('zoom-slider');
const xOffsetSlider = document.getElementById('x-offset-slider');
const yOffsetSlider = document.getElementById('y-offset-slider');

function resizeCanvas() {
  const containerWidth = document.querySelector('.frame').offsetWidth;
  canvas.width = containerWidth;
  canvas.height = containerWidth;
  drawImageOnCanvas();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawImageOnCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (userImageLoaded) {
    const imgAspect = userImage.width / userImage.height;
    drawWidth = canvas.width * zoomFactor;
    drawHeight = drawWidth / imgAspect;

    offsetX = (canvas.width - drawWidth) / 2 + parseFloat(xOffsetSlider.value);
    offsetY = (canvas.height - drawHeight) / 2 + parseFloat(yOffsetSlider.value);

    context.drawImage(userImage, offsetX, offsetY, drawWidth, drawHeight);
  }

  context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
}

uploadInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    userImage = new Image();
    userImage.onload = function() {
      userImageLoaded = true;
      drawImageOnCanvas();
    };
    userImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
  fileNameDisplay.textContent = file.name;
});

zoomSlider.addEventListener('input', function() {
  zoomFactor = zoomSlider.value;
  drawImageOnCanvas();
});
xOffsetSlider.addEventListener('input', drawImageOnCanvas);
yOffsetSlider.addEventListener('input', drawImageOnCanvas);

downloadButton.addEventListener('click', function() {
  if (!userImageLoaded) {
    alert("Silakan unggah gambar terlebih dahulu.");
    return;
  }

  const exportCanvas = document.createElement('canvas');
  const exportSize = 1080;
  exportCanvas.width = exportSize;
  exportCanvas.height = exportSize;
  const exportCtx = exportCanvas.getContext('2d');

  const imgAspect = userImage.width / userImage.height;
  const zoom = parseFloat(zoomSlider.value);

  let exportDrawWidth = exportSize * zoom;
  let exportDrawHeight = exportDrawWidth / imgAspect;

  const exportOffsetX = (exportSize - exportDrawWidth) / 2 + parseFloat(xOffsetSlider.value);
  const exportOffsetY = (exportSize - exportDrawHeight) / 2 + parseFloat(yOffsetSlider.value);

  exportCtx.clearRect(0, 0, exportSize, exportSize);
  exportCtx.drawImage(userImage, exportOffsetX, exportOffsetY, exportDrawWidth, exportDrawHeight);
  exportCtx.drawImage(frameImg, 0, 0, exportSize, exportSize);

  const link = document.createElement('a');
  link.download = 'MPLS_SMANSA_TIRAY_HD.png';
  link.href = exportCanvas.toDataURL('image/png');
  link.click();

  showDownloadNotification();
});

// Copy text input & spam notifikasi
document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.getElementById('name-input');
  const originInput = document.getElementById('origin-input');
  const reasonInput = document.getElementById('reason-input');
  const mottoInput = document.getElementById('motto-input');
  const templateText = document.getElementById('template-text');
  const copyTextButton = document.getElementById('copy-text-btn');
  const notification = document.getElementById('notification');
  const spamNotification = document.getElementById('spam-notification');
  let lastCopiedText = '';

  nameInput.addEventListener('input', updateTemplateText);
  originInput.addEventListener('input', updateTemplateText);
  reasonInput.addEventListener('input', updateTemplateText);
  mottoInput.addEventListener('input', updateTemplateText);

  function updateTemplateText() {
    const name = nameInput.value || 'Nama';
    const origin = originInput.value || 'Asal sekolah';
    const reason = reasonInput.value || 'Alasan bergabung';
    const motto = mottoInput.value || 'Motto';
    document.getElementById('name').textContent = name;
    document.getElementById('origin').textContent = origin;
    document.getElementById('reason').textContent = reason;
    document.getElementById('motto').textContent = motto;
  }

  copyTextButton.addEventListener('click', function () {
    const text = templateText.innerText;
    if (text === lastCopiedText) {
      showSpamNotification();
    } else {
      copyTextToClipboard(text);
      lastCopiedText = text;
      showNotification();
    }
  });

  function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  function showSpamNotification() {
    spamNotification.classList.add('show');
    setTimeout(() => {
      spamNotification.classList.remove('show');
    }, 3000);
  }

  frameImg.onload = function () {
    drawImageOnCanvas();
  };
});

function showDownloadNotification() {
  const downloadNotification = document.getElementById('download-notification');
  downloadNotification.classList.add('show');
  setTimeout(() => {
    downloadNotification.classList.remove('show');
  }, 3000);
}
