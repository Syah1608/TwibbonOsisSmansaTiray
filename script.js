const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadButton = document.getElementById('download-btn');
const fileNameDisplay = document.getElementById('file-name');
const frameImg = new Image();
frameImg.src = 'twibbon_mpls.png';

let userImage = new Image();
let userImageLoaded = false;

let offsetX = 0;   // Posisi X gambar
let offsetY = 0;   // Posisi Y gambar
let drawWidth = canvas.width;  // Lebar gambar
let drawHeight = canvas.height;  // Tinggi gambar
let zoomFactor = 1;  // Faktor zoom

let isDragging = false; // Untuk mengaktifkan fungsi drag gambar

// Kontrol slider untuk zoom dan geser
const zoomSlider = document.getElementById('zoom-slider');
const xOffsetSlider = document.getElementById('x-offset-slider');
const yOffsetSlider = document.getElementById('y-offset-slider');

// Resize canvas to maintain aspect ratio
function resizeCanvas() {
    const containerWidth = document.querySelector('.frame').offsetWidth;
    canvas.width = containerWidth;
    canvas.height = containerWidth;  // Menjaga rasio persegi untuk canvas
    drawImageOnCanvas();  // Gambar ulang setelah resize canvas
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // Memanggilnya saat halaman dimuat

// Fungsi untuk menggambar ulang gambar pengguna di canvas
function drawImageOnCanvas() {
    if (userImageLoaded) {
        context.clearRect(0, 0, canvas.width, canvas.height);  // Bersihkan kanvas sebelum menggambar

        // Menjaga gambar agar tetap sesuai ukuran frame tanpa distorsi
        const imgAspect = userImage.width / userImage.height;
        const canvasAspect = canvas.width / canvas.height;

        // Menentukan ukuran gambar sesuai rasio dan faktor zoom
        drawWidth = canvas.width * zoomFactor;
        drawHeight = drawWidth / imgAspect;

        // Posisi gambar agar selalu berada di tengah, plus slider offset
        offsetX = (canvas.width - drawWidth) / 2 + parseFloat(xOffsetSlider.value); // Geser horizontal
        offsetY = (canvas.height - drawHeight) / 2 + parseFloat(yOffsetSlider.value); // Geser vertikal

        // Gambar gambar pengguna sesuai dengan posisi dan ukuran
        context.drawImage(userImage, offsetX, offsetY, drawWidth, drawHeight);
        context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);  // Gambar frame di atas gambar
    }
}

// Event untuk mengunggah gambar
uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        userImage = new Image();
        userImage.onload = function() {
            userImageLoaded = true;
            drawImageOnCanvas(); // Menggambar ulang gambar setelah dimuat
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
    fileNameDisplay.textContent = file.name;
});

// Event untuk menyeret gambar (Mouse / Touch)
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', dragImage);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('touchstart', startDragging);
canvas.addEventListener('touchmove', dragImage);
canvas.addEventListener('touchend', stopDragging);

function startDragging(e) {
    e.preventDefault();
    if (!userImageLoaded) return;

    const mouseX = e.offsetX || e.touches[0].clientX - canvas.offsetLeft;
    const mouseY = e.offsetY || e.touches[0].clientY - canvas.offsetTop;

    // Cek apakah klik di atas gambar
    if (mouseX >= offsetX && mouseX <= offsetX + drawWidth && mouseY >= offsetY && mouseY <= offsetY + drawHeight) {
        isDragging = true;
    }
}

function dragImage(e) {
    e.preventDefault();
    if (!userImageLoaded || !isDragging) return;

    const mouseX = e.offsetX || e.touches[0].clientX - canvas.offsetLeft;
    const mouseY = e.offsetY || e.touches[0].clientY - canvas.offsetTop;

    // Menggeser gambar
    offsetX = mouseX - drawWidth / 2;
    offsetY = mouseY - drawHeight / 2;

    drawImageOnCanvas();
}

function stopDragging() {
    isDragging = false;
}

// Fungsi untuk mengubah ukuran gambar berdasarkan kontrol zoom
zoomSlider.addEventListener('input', function() {
    zoomFactor = zoomSlider.value;
    drawImageOnCanvas();
});

// Fungsi untuk menggeser gambar berdasarkan slider
xOffsetSlider.addEventListener('input', function() {
    drawImageOnCanvas();
});

yOffsetSlider.addEventListener('input', function() {
    drawImageOnCanvas();
});

//Menangani tombol download
downloadButton.addEventListener('click', function() {
    if (!userImageLoaded) {
        alert("Silakan unggah gambar terlebih dahulu.");
        return;
    }

    // Gambar ulang sebelum download
    drawImageOnCanvas();

    const link = document.createElement('a');
    link.download = 'MPLS_SMANSA_TIRAY.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});



// Menangani input untuk teks pengguna (Nama, Asal, dan Motto)
document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('name-input');
    const originInput = document.getElementById('origin-input');
    const mottoInput = document.getElementById('motto-input');
    const templateText = document.getElementById('template-text');
    const copyTextButton = document.getElementById('copy-text-btn');
    const notification = document.getElementById('notification');
    const spamNotification = document.getElementById('spam-notification');
    let lastCopiedText = '';

    nameInput.addEventListener('input', updateTemplateText);
    originInput.addEventListener('input', updateTemplateText);
    mottoInput.addEventListener('input', updateTemplateText);

    function updateTemplateText() {
        const name = nameInput.value || 'Nama';
        const origin = originInput.value || 'Asal';
        const motto = mottoInput.value || '"Pendidikan bukan hanya tentang mengisi pikiran, tetapi juga membentuk karakter." - Imam Syafi\'i.';
        document.getElementById('name').textContent = name;
        document.getElementById('origin').textContent = origin;
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
        // Gambar frame kosong di awal
        context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    };
});
document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('name-input');
    const originInput = document.getElementById('origin-input');
    const reasonInput = document.getElementById('reason-input');
    const mottoInput = document.getElementById('motto-input');
    const templateText = document.getElementById('template-text');
    const copyTextButton = document.getElementById('copy-text-btn');
    const notification = document.getElementById('notification');
  
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
      copyTextToClipboard(text);
      showNotification();
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
      notification.textContent = "Sudah di salin";
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
        const scale = 3;
    const hdCanvas = document.createElement('canvas');
    hdCanvas.width = canvas.width * scale;
    hdCanvas.height = canvas.height * scale;
    const hdContext = hdCanvas.getContext('2d');

    const imgAspect = userImage.width / userImage.height;
    const drawWidthHD = hdCanvas.width * zoomFactor;
    const drawHeightHD = drawWidthHD / imgAspect;
    const offsetXHD = (hdCanvas.width - drawWidthHD) / 2 + parseFloat(xOffsetSlider.value) * scale;
    const offsetYHD = (hdCanvas.height - drawHeightHD) / 2 + parseFloat(yOffsetSlider.value) * scale;

    hdContext.drawImage(userImage, offsetXHD, offsetYHD, drawWidthHD, drawHeightHD);
    const hdFrame = new Image();
    hdFrame.onload = () => {
        hdContext.drawImage(hdFrame, 0, 0, hdCanvas.width, hdCanvas.height);
        const link = document.createElement('a');
        link.download = 'MPLS_SMANSA_TIRAY_HD.png';
        link.href = hdCanvas.toDataURL('image/png');
        link.click();
    };
    hdFrame.src = 'twibbon_mpls.png';
});

 
  
