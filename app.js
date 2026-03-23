let stream = null;
let map = null;
let marker = null;

let photoBlob = null;
let photoUrl = null;
let coords = null;
let timestamp = null;
let cameraMode = 'environment';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photoPreview = document.getElementById('photoPreview');
const emptyPreview = document.getElementById('emptyPreview');

const startCameraBtn = document.getElementById('startCameraBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const getLocationBtn = document.getElementById('getLocationBtn');
const shareBtn = document.getElementById('shareBtn');
const clearBtn = document.getElementById('clearBtn');

const latValue = document.getElementById('latValue');
const lngValue = document.getElementById('lngValue');
const timeValue = document.getElementById('timeValue');
const messageValue = document.getElementById('messageValue');

function showMessage(text) {
  messageValue.textContent = text;
}

function updateInfo() {
  latValue.textContent = coords ? coords.lat.toFixed(6) : '—';
  lngValue.textContent = coords ? coords.lng.toFixed(6) : '—';
  timeValue.textContent = timestamp ? new Date(timestamp).toLocaleString('pl-PL') : '—';

  shareBtn.disabled = !(photoBlob && coords);
}

function initMap() {
  map = L.map('map').setView([50.06143, 19.93658], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function updateMap(lat, lng) {
  if (marker) {
    marker.remove();
  }

  marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`Zdjęcie wykonano tutaj<br>${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  map.setView([lat, lng], 16);
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
  
    showMessage('Kamerya zatrzymana.');
}

async function switchCamera() {
  cameraMode = cameraMode === 'environment' ? 'user' : 'environment';
  await startCamera();
}

async function takePhoto() {
  if (!video.videoWidth || !video.videoHeight) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  photoUrl = canvas.toDataURL('image/jpeg', 0.9);
  photoBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  timestamp = Date.now();

  photoPreview.src = photoUrl;
  photoPreview.classList.remove('d-none');
  emptyPreview.classList.add('d-none');

  updateInfo();
  showMessage('Zdjęcie zrobione.');
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    updateMap(coords.lat, coords.lng);
    updateInfo();
    showMessage('Lokalizacja pobrana.');
  });
}

startCameraBtn.addEventListener('click', startCamera);
switchCameraBtn.addEventListener('click', switchCamera);
takePhotoBtn.addEventListener('click', takePhoto);
stopCameraBtn.addEventListener('click', stopCamera);
getLocationBtn.addEventListener('click', getLocation);

initMap();
updateInfo();