let stream = null;
let cameraMode = 'environment';

const video = document.getElementById('video');

const startCameraBtn = document.getElementById('startCameraBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const messageValue = document.getElementById('messageValue');

function showMessage(text) {
  messageValue.textContent = text;
}

async function startCamera() {
  stopCamera();

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: cameraMode },
    audio: false
  });

  video.srcObject = stream;
  await video.play();

  takePhotoBtn.disabled = false;
  stopCameraBtn.disabled = false;
  switchCameraBtn.disabled = false;

  showMessage(`Kamera włączona (${cameraMode === 'user' ? 'przednia' : 'tylna'}).`);
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  video.srcObject = null;
  takePhotoBtn.disabled = true;
  stopCameraBtn.disabled = true;
}

async function switchCamera() {
  cameraMode = cameraMode === 'environment' ? 'user' : 'environment';
  await startCamera();
}

startCameraBtn.addEventListener('click', startCamera);
switchCameraBtn.addEventListener('click', switchCamera);
stopCameraBtn.addEventListener('click', stopCamera);