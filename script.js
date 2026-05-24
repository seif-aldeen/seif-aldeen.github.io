/* ============================================================
   PORTFOLIO DATA LAYER
   ============================================================ */
const STORAGE_KEY = 'portfolio_projects';
const DEFAULT_PROJECTS = [
  {
    id: 'suspension',
    label: 'Automotive / CAD',
    title: 'Formula Student Suspension System',
    description: 'Complete mechanical design and simulation of a Formula Student car suspension system, focusing on vehicle dynamics and structural integrity.',
    tags: ['Autodesk Inventor', 'MATLAB / Simulink', 'Vehicle Dynamics'],
    images: [],
    detail: {
      overview: 'A complete suspension system designed for a Formula Student race car, focusing on vehicle dynamics, suspension geometry optimization, and structural performance.',
      role: 'I designed the suspension geometry and created the full CAD assembly using Autodesk Inventor. I also analyzed suspension kinematics and developed a quarter-car dynamic simulation model in MATLAB/Simulink.',
      highlights: 'Double wishbone suspension design\nSuspension geometry optimization\nCamber, caster, and toe analysis\nVehicle dynamics simulation\nQuarter-car Simulink model\nLoad transfer and ride analysis\nCAD assembly and packaging',
      challenges: 'One of the biggest challenges was balancing suspension stiffness and dynamic response while maintaining realistic Formula Student constraints. Multiple iterations were tested using simulation tools to optimize suspension travel and wheel alignment behavior.',
      results: 'The final design achieved stable suspension kinematics and realistic dynamic behavior suitable for Formula Student applications.',
      technologies: 'Autodesk Inventor \u2022 MATLAB \u2022 Simulink \u2022 OptimumKinematics \u2022 Vehicle Dynamics \u2022 Mechanical Design'
    }
  },
  {
    id: 'bldc',
    label: 'Power Electronics',
    title: 'BLDC Motor Controller (ESC)',
    description: 'Developed an open-loop 6-step commutation driver for a 3-phase BLDC motor utilizing MOSFET inverter stages and PWM speed control.',
    tags: ['Arduino UNO', 'Power Electronics', 'C++'],
    images: [],
    detail: {
      overview: 'An electronic speed controller for brushless DC motors was designed and tested. The system uses 6-step commutation with hall-effect sensor feedback or sensorless back-EMF detection for precise motor control.',
      role: 'I designed the power stage using discrete MOSFETs, wrote the Arduino firmware for commutation logic and PWM generation, and tested the system across various load conditions.',
      highlights: '',
      challenges: '',
      results: '',
      technologies: ''
    }
  },
  {
    id: 'auxilio',
    label: 'Robotics / Autonomous',
    title: 'Auxilio CTF Robot',
    description: '1st place winning autonomous robot designed for maze navigation, obstacle avoidance, and mechanical flag capture under competition constraints.',
    tags: ['ESP32', 'Sensor Fusion', 'State Machines'],
    images: [],
    detail: {
      overview: 'A fully autonomous robot built for a capture-the-flag competition. It uses sensor fusion (ultrasonic, IR, and encoder data) to navigate unknown mazes and capture opponent flags while avoiding obstacles.',
      role: 'I architected the state machine logic on ESP32, integrated multiple sensor inputs for reliable navigation, and designed the mechanical flag-capture mechanism with servo actuation.',
      highlights: '',
      challenges: '',
      results: '',
      technologies: ''
    }
  },
  {
    id: 'fault-detection',
    label: 'Software / Robotics',
    title: 'Fault Detection State Machine',
    description: 'Developed a robust fault detection and transition logic system in Python to monitor and manage complex robotic states safely.',
    tags: ['Python', 'Algorithm Logic', 'Systems Engineering'],
    images: [],
    detail: {
      overview: 'A Python-based state machine framework for fault detection in robotic systems. It monitors sensor inputs, detects anomalies, and transitions between safe, warning, and error states with appropriate recovery actions.',
      role: 'I designed the state transition logic, implemented the monitoring system in Python with proper exception handling, and tested it with simulated fault injection to validate robustness.',
      highlights: '',
      challenges: '',
      results: '',
      technologies: ''
    }
  }
];

const DEV_SECRET = 'seiff';
const PAGE_KEY = 'portfolio_page';

let projects = [];
let isDevMode = false;
let editingProjectId = null;
let lightboxImages = [];
let lightboxIndex = 0;
let fadeObserver = null;
let pageContent = null;

/* ============================================================
   INDEXED DB — large storage for images (50MB+)
   ============================================================ */
function openDB(callback) {
  var req = indexedDB.open('PortfolioDB', 1);
  req.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('store')) db.createObjectStore('store');
  };
  req.onsuccess = function(e) { callback(e.target.result); };
  req.onerror = function() { callback(null); };
}

function loadFromDB(callback) {
  openDB(function(db) {
    if (!db) { callback(null); return; }
    var tx = db.transaction('store', 'readonly');
    var store = tx.objectStore('store');
    var req = store.get('projects');
    req.onsuccess = function() { callback(req.result || null); };
    req.onerror = function() { callback(null); };
  });
}

function saveToDB(data, callback) {
  openDB(function(db) {
    if (!db) { callback(false); return; }
    var tx = db.transaction('store', 'readwrite');
    var store = tx.objectStore('store');
    store.put(data, 'projects');
    tx.oncomplete = function() { callback(true); };
    tx.onerror = function() { callback(false); };
  });
}

function sanitizeProjects() {
  projects.forEach(function(p) {
    if (p.images) p.images = p.images.filter(function(img) { return img.src && img.src.indexOf('via.placeholder') === -1; });
    if (!p.detail) p.detail = {};
    if (!p.detail.highlights) p.detail.highlights = '';
    if (!p.detail.challenges) p.detail.challenges = '';
    if (!p.detail.results) p.detail.results = '';
    if (!p.detail.technologies) p.detail.technologies = '';
  });
}

async function loadData(callback) {
  try {
    const response = await fetch('assets/portfolio-data.json');

    if (!response.ok) {
      throw new Error('Failed to load portfolio data');
    }

    projects = await response.json();

    sanitizeProjects();

    if (callback) callback();

  } catch (error) {

    console.error('Error loading portfolio data:', error);

    projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));

    sanitizeProjects();

    if (callback) callback();
  }
}

function saveData(callback) {
  saveToDB(projects, function(success) {
    if (success) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch (_) {}
      if (callback) callback('');
    } else {
      if (callback) callback('Failed to save to database');
    }
  });
}

function loadPageContent(callback) {
  loadFromDB(function(data) {
    if (data && data.pageContent) pageContent = data.pageContent;
    if (!pageContent) pageContent = {};
    if (callback) callback();
  });
}

function savePageContent(callback) {
  openDB(function(db) {
    if (!db) { if (callback) callback(false); return; }
    var tx = db.transaction('store', 'readwrite');
    var store = tx.objectStore('store');
    store.put(pageContent, PAGE_KEY);
    tx.oncomplete = function() {
      try { localStorage.setItem(PAGE_KEY, JSON.stringify(pageContent)); } catch (_) {}
      if (callback) callback(true);
    };
    tx.onerror = function() { if (callback) callback(false); };
  });
}

function getProject(id) {
  return projects.find(function(p) { return p.id === id; });
}

function escHtml(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ============================================================
   MEDIA HELPERS
   ============================================================ */
function isVideoUrl(url) {
  if (!url) return false;
  return /drive\.google\.com/.test(url) || /youtube\.com|youtu\.be/.test(url) || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function getEmbedUrl(src) {
  var gDriveMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch) return 'https://drive.google.com/file/d/' + gDriveMatch[1] + '/preview';
  var gIdMatch = src.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gIdMatch) return 'https://drive.google.com/file/d/' + gIdMatch[1] + '/preview';
  var ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1];
  return src;
}

function detectMediaType(src) {
  return isVideoUrl(src) ? 'video' : 'image';
}

function compressImage(dataUrl, maxW, maxH, quality, cb) {
  var img = new Image();
  img.onload = function() {
    var w = img.width, h = img.height;
    if (w <= maxW && h <= maxH) { cb(dataUrl); return; }
    var r = Math.min(maxW / w, maxH / h, 1);
    var c = document.createElement('canvas');
    c.width = Math.round(w * r); c.height = Math.round(h * r);
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, c.width, c.height);
    cb(c.toDataURL('image/jpeg', quality));
  };
  img.onerror = function() { cb(dataUrl); };
  img.src = dataUrl;
}

function openImageEditor(dataUrl, callback) {
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = '<div class="admin-modal" style="max-width:650px;text-align:center;"><div class="admin-modal-header"><h2>\u270F\u200dEdit Image</h2></div><div class="admin-modal-body"><div id="imgEditStage" style="position:relative;max-height:380px;overflow:hidden;margin-bottom:14px;border-radius:8px;background:#0f172a;display:flex;align-items:center;justify-content:center;cursor:crosshair;"><img id="editImgPreview" src="" style="max-width:100%;max-height:360px;object-fit:contain;transition:transform 0.25s;display:block;"><canvas id="imgCropCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;cursor:crosshair;"></canvas></div><div id="cropInfo" style="display:none;color:var(--text-muted);font-size:0.85rem;margin-bottom:8px;">Drag to select crop area</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"><button class="admin-btn" id="imgRotateL">\u21BA Rotate</button><button class="admin-btn" id="imgRotateR">\u21BB Rotate</button><button class="admin-btn" id="imgFlipH">\u2194 Flip</button><button class="admin-btn" id="imgFlipV">\u2195 Flip</button><button class="admin-btn" id="imgCropBtn">\u2702 Crop</button></div></div><div class="admin-modal-footer"><button class="button button-secondary" id="imgEditCancel">Cancel</button><button class="button button-primary" id="imgEditSave">Apply</button></div></div>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('#editImgPreview');
  var stage = overlay.querySelector('#imgEditStage');
  var cropCanvas = overlay.querySelector('#imgCropCanvas');
  var cropCtx = cropCanvas.getContext('2d');
  var cropInfo = overlay.querySelector('#cropInfo');
  var currentAngle = 0, flippedH = false, flippedV = false;
  var cropping = false, cropMode = false;
  var cropRect = { x: 0, y: 0, w: 0, h: 0 };
  var dragStart = null;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var srcImg = new Image();

  srcImg.onload = function() {
    canvas.width = srcImg.width; canvas.height = srcImg.height;
    ctx.drawImage(srcImg, 0, 0);
    img.src = dataUrl;
    img.onload = function() { updateCropCanvas(); };
    updateCropCanvas();
  };
  srcImg.src = dataUrl;

  function updatePreview() {
    var tf = '';
    if (currentAngle !== 0) tf += 'rotate(' + currentAngle + 'deg) ';
    if (flippedH) tf += 'scaleX(-1) ';
    if (flippedV) tf += 'scaleY(-1) ';
    img.style.transform = tf.trim();
    if (cropMode) updateCropCanvas();
  }

  function updateCropCanvas() {
    if (!cropMode) { cropCanvas.style.display = 'none'; return; }
    cropCanvas.style.display = 'block';
    var rect = stage.getBoundingClientRect();
    cropCanvas.width = rect.width;
    cropCanvas.height = rect.height;
    cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
    cropCtx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);
    if (cropRect.w > 0 && cropRect.h > 0) {
      cropCtx.fillStyle = 'rgba(0,0,0,0.55)';
      cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
      cropCtx.clearRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      cropCtx.strokeStyle = '#f59e0b';
      cropCtx.lineWidth = 2;
      cropCtx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
    }
  }

  function getStagePos(e) {
    var rect = stage.getBoundingClientRect();
    var x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    var y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    return { x: Math.max(0, Math.min(x, rect.width)), y: Math.max(0, Math.min(y, rect.height)) };
  }

  function startCropDrag(e) {
    if (!cropMode) return;
    e.preventDefault();
    dragStart = getStagePos(e);
    cropRect = { x: dragStart.x, y: dragStart.y, w: 0, h: 0 };
    cropInfo.textContent = 'Release to set crop area';
    cropping = true;
  }

  function moveCropDrag(e) {
    if (!cropping || !cropMode) return;
    e.preventDefault();
    var pos = getStagePos(e);
    cropRect.x = Math.min(dragStart.x, pos.x);
    cropRect.y = Math.min(dragStart.y, pos.y);
    cropRect.w = Math.abs(pos.x - dragStart.x);
    cropRect.h = Math.abs(pos.y - dragStart.y);
    updateCropCanvas();
  }

  function endCropDrag(e) {
    if (!cropping) return;
    cropping = false;
    if (cropRect.w < 10 || cropRect.h < 10) {
      cropRect = { x: 0, y: 0, w: 0, h: 0 };
      cropInfo.textContent = 'Selection too small, try again';
    } else {
      cropInfo.textContent = 'Crop area selected. Press Apply Crop or drag again.';
    }
    updateCropCanvas();
  }

  stage.addEventListener('mousedown', startCropDrag);
  document.addEventListener('mousemove', moveCropDrag);
  document.addEventListener('mouseup', endCropDrag);
  stage.addEventListener('touchstart', startCropDrag, { passive: false });
  document.addEventListener('touchmove', moveCropDrag, { passive: false });
  document.addEventListener('touchend', endCropDrag);

  function applyTransform() {
    var w = srcImg.width, h = srcImg.height;
    var rad = currentAngle * Math.PI / 180;
    var sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
    var nw = Math.ceil(w * cos + h * sin), nh = Math.ceil(w * sin + h * cos);
    canvas.width = nw; canvas.height = nh;
    ctx.clearRect(0, 0, nw, nh);
    ctx.save();
    ctx.translate(nw / 2, nh / 2);
    ctx.rotate(rad);
    ctx.scale(flippedH ? -1 : 1, flippedV ? -1 : 1);
    ctx.drawImage(srcImg, -w / 2, -h / 2);
    ctx.restore();
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  overlay.querySelector('#imgRotateL').addEventListener('click', function() { currentAngle = (currentAngle - 90) % 360; updatePreview(); });
  overlay.querySelector('#imgRotateR').addEventListener('click', function() { currentAngle = (currentAngle + 90) % 360; updatePreview(); });
  overlay.querySelector('#imgFlipH').addEventListener('click', function() { flippedH = !flippedH; updatePreview(); });
  overlay.querySelector('#imgFlipV').addEventListener('click', function() { flippedV = !flippedV; updatePreview(); });

  function enterCropMode() {
    cropMode = true;
    cropInfo.style.display = 'block';
    cropInfo.textContent = 'Drag on the image to select crop area';
    document.getElementById('imgCropBtn').textContent = '\u2713 Apply Crop';
    cropRect = { x: 0, y: 0, w: 0, h: 0 };
    updateCropCanvas();
  }

  function applyPendingTransforms(cb) {
    if (currentAngle === 0 && !flippedH && !flippedV) { cb(); return; }
    var transformedUrl = applyTransform();
    currentAngle = 0; flippedH = false; flippedV = false;
    var newImg = new Image();
    newImg.onload = function() {
      srcImg = newImg;
      canvas.width = srcImg.width; canvas.height = srcImg.height;
      ctx.drawImage(srcImg, 0, 0);
      img.src = transformedUrl;
      img.onload = function() { cb(); };
    };
    newImg.src = transformedUrl;
  }

  overlay.querySelector('#imgCropBtn').addEventListener('click', function() {
    var btn = document.getElementById('imgCropBtn');
    if (cropMode && cropRect.w > 0 && cropRect.h > 0) {
      var rect = stage.getBoundingClientRect();
      var scaleX = srcImg.naturalWidth / rect.width;
      var scaleY = srcImg.naturalHeight / rect.height;
      var sx = Math.round(cropRect.x * scaleX), sy = Math.round(cropRect.y * scaleY);
      var sw = Math.round(cropRect.w * scaleX), sh = Math.round(cropRect.h * scaleY);
      canvas.width = sw; canvas.height = sh;
      ctx.clearRect(0, 0, sw, sh);
      ctx.drawImage(srcImg, sx, sy, sw, sh, 0, 0, sw, sh);
      var croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
      srcImg = new Image();
      srcImg.onload = function() {
        img.src = croppedUrl;
        currentAngle = 0; flippedH = false; flippedV = false;
        cropMode = false; cropRect = { x: 0, y: 0, w: 0, h: 0 };
        cropCanvas.style.display = 'none';
        cropInfo.style.display = 'none';
        btn.textContent = '\u2702 Crop';
        updatePreview();
      };
      srcImg.src = croppedUrl;
      return;
    }
    if (!cropMode) {
      applyPendingTransforms(function() { enterCropMode(); });
    } else {
      cropMode = false;
      cropInfo.style.display = 'none';
      cropCanvas.style.display = 'none';
      btn.textContent = '\u2702 Crop';
    }
  });

  overlay.querySelector('#imgEditCancel').addEventListener('click', function() { overlay.remove(); });
  overlay.querySelector('#imgEditSave').addEventListener('click', function() {
    if (cropMode) {
      cropMode = false;
      cropCanvas.style.display = 'none';
    }
    callback(applyTransform());
    overlay.remove();
  });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  var existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2500);
}

/* ============================================================
   HAMBURGER
   ============================================================ */
function initHamburger() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function() {
    var isOpen = nav.classList.toggle('open');
    btn.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen);
  });
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function setupFadeObserver() {
  try {
    fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  } catch (_) {}
}

function observeFadeElements() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el) {
    if (fadeObserver) fadeObserver.observe(el);
  });
}

/* ============================================================
   HEADER SCROLL
   ============================================================ */
function initHeaderScroll() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function setYear() {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   RENDER — Index page cards
   ============================================================ */
function renderProjects() {
  var grid = document.getElementById('projectGrid');
  if (!grid) return;
  grid.innerHTML = '';
  projects.forEach(function(proj) {
    var card = document.createElement('a');
    card.href = 'project.html?id=' + encodeURIComponent(proj.id);
    card.className = 'work-card fade-in';
    var overlay = '';
    if (isDevMode) {
      overlay = '<div class="edit-overlay"><button class="admin-edit-btn" data-id="' + proj.id + '" data-action="edit">\u270E\u00a0Edit</button><button class="admin-del-btn" data-id="' + proj.id + '" title="Delete project">&times;</button></div>';
    }
    var coverHtml = '';
    if (proj.images && proj.images.length > 0 && proj.images[0].src) {
      var firstType = proj.images[0].type || detectMediaType(proj.images[0].src);
      var coverImg = '<img class="card-cover" src="' + escHtml(proj.images[0].src) + '" alt="' + escHtml(proj.title) + '" loading="lazy">';
      coverHtml = firstType === 'video' ? '<div class="card-cover-wrap">' + coverImg + '<span class="card-cover-play">\u25B6</span></div>' : coverImg;
    }
    card.innerHTML = overlay + coverHtml + '<div class="card-content"><span class="card-label">' + escHtml(proj.label) + '</span><h3>' + escHtml(proj.title) + '</h3><p>' + escHtml(proj.description) + '</p><ul class="tag-list">' + proj.tags.map(function(t) { return '<li>' + escHtml(t) + '</li>'; }).join('') + '</ul></div>';
    if (isDevMode) {
      card.addEventListener('click', function(e) { e.preventDefault(); openEditor(proj.id); });
      card.addEventListener('mouseenter', function() { var o = card.querySelector('.edit-overlay'); if (o) o.style.opacity = '1'; });
      card.addEventListener('mouseleave', function() { var o = card.querySelector('.edit-overlay'); if (o) o.style.opacity = ''; });
    }
    grid.appendChild(card);
  });
  if (isDevMode) {
    var addCard = document.createElement('div');
    addCard.className = 'admin-add-card';
    addCard.innerHTML = '<span style="font-size:1.5rem;">+</span> Add Project';
    addCard.addEventListener('click', function() { openEditor(null); });
    grid.appendChild(addCard);
  }
  observeFadeElements();
  updateAboutStats();
}

function updateAboutStats() {
  var el = document.getElementById('statProjects');
  if (el) el.textContent = projects.length;
  var yearsEl = document.getElementById('statYears');
  if (yearsEl) {
    var startYear = 2024;
    var diff = new Date().getFullYear() - startYear;
    yearsEl.textContent = diff;
  }
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
function deleteProject(id) {
  if (!confirm('Delete project "' + id + '"? This cannot be undone.')) return;
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects.splice(i, 1);
      break;
    }
  }
  saveData(function() {
    renderProjects();
    showToast('Project "' + id + '" deleted');
  });
}

function initAdminPanel() {
  isDevMode = true;
  document.body.classList.add('dev-mode');
  renderProjects();
  var bar = document.createElement('div');
  bar.className = 'admin-bar';
  bar.innerHTML = '<div class="admin-bar-badge">Dev Mode Active</div><div class="admin-bar-actions"><button class="admin-btn admin-btn-success" id="adminExport">\u2B07\u00a0Export</button><button class="admin-btn" id="adminImport">\u2B06\u00a0Import</button><button class="admin-btn" id="adminStorageCheck">\u2699\u00a0Check</button><button class="admin-btn admin-btn-warn" id="adminStorageReset">\u267B\u00a0Reset</button><button class="admin-btn admin-btn-danger" id="adminExit">\u2716\u00a0Exit Dev Mode</button></div>';
  document.body.appendChild(bar);
  document.getElementById('adminExport').addEventListener('click', function() {
    var blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  });
  document.getElementById('adminImport').addEventListener('click', function() { document.getElementById('adminFileInput').click(); });
  document.getElementById('adminStorageCheck').addEventListener('click', function() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { showToast('No saved data'); return; }
    try {
      var data = JSON.parse(raw);
      var totalImgs = 0;
      data.forEach(function(p) { if (p.images) totalImgs += p.images.length; });
      var kb = (new Blob([raw]).size / 1024).toFixed(1);
      var extra = kb > 4000 ? ' \u26A0\uFE0F Near limit!' : '';
      showToast(kb + 'KB, ' + data.length + ' projects, ' + totalImgs + ' images' + extra);
    } catch (_) { showToast('Data corrupted'); }
  });
  document.getElementById('adminStorageReset').addEventListener('click', function() {
    if (confirm('Delete ALL stored data and reset to default projects? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
      saveData(function() {
        renderProjects();
        showToast('Storage reset. You can now add projects with auto-compressed images.');
      });
    }
  });
  document.getElementById('adminExit').addEventListener('click', function() {
    var url = new URL(window.location);
    url.searchParams.delete('dev');
    window.location.href = url.toString();
  });
  var importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.style.display = 'none';
  importInput.id = 'adminFileInput';
  document.body.appendChild(importInput);
  importInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var r = new FileReader();
    r.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        data.forEach(function(p) { if (!p.id || !p.title) throw new Error('Missing id/title'); });
        projects = data;
        saveData(function() {
          renderProjects();
          showToast('Imported ' + projects.length + ' project(s)');
        });
      } catch (err) { showToast('Import failed: ' + err.message); }
    };
    r.readAsText(file);
    e.target.value = '';
  });
  // Wire delete buttons on cards
  document.querySelectorAll('.admin-del-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      deleteProject(this.getAttribute('data-id'));
    });
  });
}

/* ============================================================
   SECTION EDITOR (page content)
   ============================================================ */
function renderSectionContent() {
  if (!pageContent) return;
  Object.keys(pageContent).forEach(function(key) {
    var el = document.getElementById(key);
    if (!el) return;
    var val = pageContent[key];
    if (el.tagName === 'IMG') {
      if (val) el.src = val;
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = val;
    } else if (el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'SPAN' || el.tagName === 'DIV') {
      el.innerHTML = val;
    }
  });
}

function openSectionEditor(sectionId) {
  var fields = [];
  var labels = [];
  var elements = document.querySelectorAll('#' + sectionId + ' [data-edit]');
  elements.forEach(function(el) {
    fields.push({ id: el.id, value: el.tagName === 'IMG' ? el.src : el.innerHTML });
    labels.push(el.getAttribute('data-label') || el.id);
  });
  if (fields.length === 0) { showToast('No editable fields in this section'); return; }
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = '<div class="admin-modal" style="max-width:700px;"><div class="admin-modal-header"><h2>Edit ' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + '</h2><button class="admin-modal-close" id="secClose">&times;</button></div><div class="admin-modal-body">' +
    fields.map(function(f, i) {
      var isImg = document.getElementById(f.id) && document.getElementById(f.id).tagName === 'IMG';
      return '<div class="admin-field"><label>' + escHtml(labels[i]) + '</label>' +
        (isImg ? '<input class="admin-input" id="sec-' + f.id + '" value="' + escHtml(f.value) + '" placeholder="Image URL..."><br><input type="file" accept="image/*" id="sec-file-' + f.id + '" style="margin-top:6px;">' :
        '<textarea class="admin-input" id="sec-' + f.id + '" rows="4">' + escHtml(f.value) + '</textarea>') +
        '</div>';
    }).join('') +
    '</div><div class="admin-modal-footer"><button class="button button-secondary" id="secCancel">Cancel</button><button class="button button-primary" id="secSave">Save Changes</button></div></div>';
  document.body.appendChild(overlay);
  document.getElementById('secClose').addEventListener('click', function() { overlay.remove(); });
  document.getElementById('secCancel').addEventListener('click', function() { overlay.remove(); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  fields.forEach(function(f) {
    var fileInput = document.getElementById('sec-file-' + f.id);
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var r = new FileReader();
        r.onload = function(ev) {
          openImageEditor(ev.target.result, function(edited) {
            document.getElementById('sec-' + f.id).value = edited;
          });
        };
        r.readAsDataURL(file);
      });
    }
  });
  document.getElementById('secSave').addEventListener('click', function() {
    fields.forEach(function(f) {
      var input = document.getElementById('sec-' + f.id);
      if (input) {
        pageContent[f.id] = input.value;
        var el = document.getElementById(f.id);
        if (el) {
          if (el.tagName === 'IMG') el.src = input.value;
          else el.innerHTML = input.value;
        }
      }
    });
    savePageContent(function() { showToast('Section updated'); });
    overlay.remove();
  });
}

function initSectionEditors() {
  document.querySelectorAll('[data-section]').forEach(function(section) {
    var btn = document.createElement('button');
    btn.className = 'section-edit-btn';
    btn.innerHTML = '\u270E';
    btn.title = 'Edit this section';
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openSectionEditor(section.id);
    });
    section.style.position = 'relative';
    section.appendChild(btn);
  });
  // Image editors: images with data-edit inside sections get click-to-change in dev mode
  document.querySelectorAll('[data-section] img[data-edit]').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.title = 'Click to change image';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', function(ev) {
        var file = ev.target.files[0];
        if (!file) return;
        var r = new FileReader();
        r.onload = function(event) {
          img.src = event.target.result;
          pageContent[img.id] = event.target.result;
          savePageContent();
        };
        r.readAsDataURL(file);
      });
      input.click();
    });
  });
}

/* ============================================================
   EDITOR MODAL
   ============================================================ */
function openEditor(projectId) {
  editingProjectId = projectId;
  var isNew = projectId === null;
  var proj = isNew ? { id: '', label: '', title: '', description: '', tags: [], images: [], detail: { overview: '', role: '', highlights: '', challenges: '', results: '', technologies: '' } } : JSON.parse(JSON.stringify(getProject(projectId)));
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';

  var imagesHTML = renderImageListHTML(proj.images);
  overlay.innerHTML = '<div class="admin-modal"><div class="admin-modal-header"><h2>' + (isNew ? 'New Project' : 'Edit Project') + '</h2><button class="admin-modal-close" id="modalClose">&times;</button></div><div class="admin-modal-body">' +
    '<div class="admin-field"><label>Project ID</label><input class="admin-input" id="edit-id" value="' + escHtml(proj.id) + '" ' + (isNew ? '' : 'readonly style="opacity:0.6"') + '></div>' +
    '<div class="admin-field"><label>Category Label</label><input class="admin-input" id="edit-label" value="' + escHtml(proj.label) + '"></div>' +
    '<div class="admin-field"><label>Title</label><input class="admin-input" id="edit-title" value="' + escHtml(proj.title) + '"></div>' +
    '<div class="admin-field"><label>Description</label><textarea class="admin-input" id="edit-desc" rows="3">' + escHtml(proj.description) + '</textarea></div>' +
    '<div class="admin-field"><label>Tags</label><input class="admin-input" id="edit-tags" value="' + escHtml(proj.tags.join(', ')) + '"></div>' +
    '<div class="admin-field"><label>Overview</label><textarea class="admin-input" id="edit-overview" rows="4">' + escHtml(proj.detail.overview) + '</textarea></div>' +
    '<div class="admin-field"><label>My Role</label><textarea class="admin-input" id="edit-role" rows="4">' + escHtml(proj.detail.role) + '</textarea></div>' +
    '<div class="admin-field"><label>Technical Highlights</label><textarea class="admin-input" id="edit-highlights" rows="4">' + escHtml(proj.detail.highlights || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Challenges</label><textarea class="admin-input" id="edit-challenges" rows="4">' + escHtml(proj.detail.challenges || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Results</label><textarea class="admin-input" id="edit-results" rows="3">' + escHtml(proj.detail.results || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Technologies Used</label><input class="admin-input" id="edit-technologies" value="' + escHtml(proj.detail.technologies || '') + '"></div>' +
    '<div class="admin-field"><label>Images &amp; Videos</label><div class="image-sortable-list" id="imageSortableList">' + imagesHTML + '</div>' +
    '<div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap;"><input class="admin-input" id="addImageUrl" placeholder="Image URL..." style="flex:2;min-width:120px;font-size:0.8rem;"><button class="admin-btn" id="addImageBtn">+ Image URL</button></div>' +
    '<div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap;"><input class="admin-input" id="addVideoUrl" placeholder="Google Drive / YouTube URL..." style="flex:2;min-width:120px;font-size:0.8rem;"><button class="admin-btn" id="addVideoBtn">+ Video</button></div>' +
    '<div style="margin:6px 0;"><label class="admin-btn admin-btn-upload" for="fileInput">Upload Images</label><input type="file" id="fileInput" accept="image/*" multiple style="display:none;"></div>' +
    '</div>' +
    '<div class="admin-modal-footer">' + (isNew ? '' : '<button class="button button-danger" id="modalDelete">\u2716\u00a0Delete</button>') + '<button class="button button-secondary" id="modalCancel">Cancel</button><button class="button button-primary" id="modalSave">' + (isNew ? 'Create Project' : 'Save Changes') + '</button></div></div>';
  document.body.appendChild(overlay);

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  overlay.addEventListener('keydown', function(e) { if ((e.key === 'Enter') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveEdit(isNew); } if (e.key === 'Escape') closeModal(); });
  document.getElementById('modalSave').addEventListener('click', function() { saveEdit(isNew); });
  var delBtn = document.getElementById('modalDelete');
  if (delBtn) delBtn.addEventListener('click', function() { var id = document.getElementById('edit-id').value.trim(); closeModal(); deleteProject(id); });

  document.getElementById('addImageBtn').addEventListener('click', addMediaFromInput);
  document.getElementById('addImageUrl').addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); addMediaFromInput(); } });
  document.getElementById('addVideoBtn').addEventListener('click', function() {
    var input = document.getElementById('addVideoUrl');
    var url = input.value.trim();
    if (!url) { showToast('Paste a video URL first'); return; }
    var list = document.getElementById('imageSortableList');
    if (!list) return;
    var items = list.querySelectorAll('.image-sortable-item');
    list.insertAdjacentHTML('beforeend', makeMediaItemHTML({ src: url, alt: 'Video ' + (items.length + 1), type: 'video' }, items.length));
    input.value = '';
    reindexMediaItems(); wireMediaButtons();
  });
  document.getElementById('addVideoUrl').addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('addVideoBtn').click(); } });

  var fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      var files = Array.from(e.target.files).filter(function(f) { return f.type.startsWith('image/'); });
      if (files.length === 0) { showToast('No image files found'); return; }
      var list = document.getElementById('imageSortableList');
      var items = list.querySelectorAll('.image-sortable-item');
      var startIdx = items.length;
      var loaded = 0;
      files.forEach(function(file, fi) {
        var reader = new FileReader();
        reader.onload = function(ev) {
          openImageEditor(ev.target.result, function(edited) {
            compressImage(edited, 1200, 1200, 0.82, function(compressed) {
              list.insertAdjacentHTML('beforeend', makeMediaItemHTML({ src: compressed, alt: file.name.replace(/\.[^.]+$/, ''), type: 'image' }, startIdx + fi));
              loaded++;
              if (loaded === files.length) { reindexMediaItems(); wireMediaButtons(); showToast('Added ' + files.length + ' image(s)'); }
            });
          });
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    });
  }

  wireMediaButtons();
}

function makeMediaItemHTML(media, index) {
  var isCover = index === 0;
  var type = media.type || detectMediaType(media.src);
  var label = media.src.length > 60 ? media.src.substring(0, 57) + '...' : media.src;
  var star = isCover ? '<span class="img-star is-cover">\u2605</span>' : '<span class="img-star" data-setcover="' + index + '">\u2606</span>';
  var badge = type === 'video' ? '<span class="img-video-badge">\u25B6</span>' : '';
  var thumb = type === 'video' ? '<div class="img-thumb img-thumb-video" style="width:48px;height:36px;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:4px;"><span style="color:#94a3b8;font-size:0.7rem;">\u25B6</span></div>' : '<img class="img-thumb" src="' + escHtml(media.src) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
  return '<div class="image-sortable-item" data-index="' + index + '" data-type="' + type + '">' + star + badge + thumb + '<input class="img-caption-input" type="text" value="' + escHtml(media.alt || '') + '" placeholder="Caption...">' +
    '<span class="img-url" title="' + escHtml(media.src) + '">' + escHtml(label) + '</span><button class="img-remove" title="Remove">&times;</button></div>';
}

function renderImageListHTML(images) {
  if (!images || images.length === 0) return '<div class="image-sortable-empty">No media yet. Add some above.</div>';
  return images.map(function(img, i) { return makeMediaItemHTML(img, i); }).join('');
}

function wireMediaButtons() {
  document.querySelectorAll('#imageSortableList .img-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.closest('.image-sortable-item').remove();
      reindexMediaItems();
    });
  });
  document.querySelectorAll('#imageSortableList .img-star[data-setcover]').forEach(function(star) {
    star.addEventListener('click', function() {
      var list = document.getElementById('imageSortableList');
      var item = this.closest('.image-sortable-item');
      list.insertBefore(item, list.firstChild);
      reindexMediaItems();
    });
  });
}

function reindexMediaItems() {
  var list = document.getElementById('imageSortableList');
  if (!list) return;
  var items = list.querySelectorAll('.image-sortable-item');
  items.forEach(function(item, i) {
    item.setAttribute('data-index', i);
    var star = item.querySelector('.img-star');
    if (i === 0) { star.className = 'img-star is-cover'; star.textContent = '\u2605'; star.removeAttribute('data-setcover'); }
    else { star.className = 'img-star'; star.textContent = '\u2606'; star.setAttribute('data-setcover', i); }
  });
}

function getMediaItems() {
  var items = document.querySelectorAll('#imageSortableList .image-sortable-item');
  var result = [];
  items.forEach(function(item) {
    var src = '';
    var urlEl = item.querySelector('.img-url');
    if (urlEl) src = urlEl.getAttribute('title') || urlEl.textContent.trim() || '';
    var captionInput = item.querySelector('.img-caption-input');
    var alt = captionInput ? captionInput.value.trim() : '';
    var type = item.getAttribute('data-type') || detectMediaType(src);
    if (src) result.push({ src: src, alt: alt || '', type: type });
  });
  return result;
}

function addMediaFromInput() {
  var input = document.getElementById('addImageUrl');
  var url = input.value.trim();
  if (!url) { showToast('Paste a URL first'); return; }
  var list = document.getElementById('imageSortableList');
  if (!list) return;
  var items = list.querySelectorAll('.image-sortable-item');
  var type = detectMediaType(url);
  list.insertAdjacentHTML('beforeend', makeMediaItemHTML({ src: url, alt: 'Media ' + (items.length + 1), type: type }, items.length));
  input.value = '';
  reindexMediaItems(); wireMediaButtons();
}

function saveEdit(isNew) {
  var id = document.getElementById('edit-id').value.trim();
  if (!id) { showToast('Please enter a Project ID'); return; }
  if (isNew && getProject(id)) { showToast('Project ID "' + id + '" already exists'); return; }
  var title = document.getElementById('edit-title').value.trim();
  if (!title) { showToast('Please enter a title'); return; }
  var images = getMediaItems();
  var data = {
    id: id,
    label: document.getElementById('edit-label') ? document.getElementById('edit-label').value.trim() : '',
    title: title,
    description: document.getElementById('edit-desc').value.trim(),
    tags: document.getElementById('edit-tags').value.trim().split(',').map(function(t) { return t.trim(); }).filter(Boolean),
    images: images,
    detail: {
      overview: document.getElementById('edit-overview').value.trim(),
      role: document.getElementById('edit-role').value.trim(),
      highlights: document.getElementById('edit-highlights').value.trim(),
      challenges: document.getElementById('edit-challenges').value.trim(),
      results: document.getElementById('edit-results').value.trim(),
      technologies: document.getElementById('edit-technologies').value.trim()
    }
  };
  if (isNew) {
    projects.push(data);
  } else {
    var proj = getProject(editingProjectId);
    if (proj) {
      proj.label = data.label;
      proj.title = data.title;
      proj.description = data.description;
      proj.tags = data.tags;
      proj.images = data.images;
      proj.detail = data.detail;
    }
  }
  saveData(function(err) {
    if (err) { showToast('Save error: ' + err); return; }
    closeModal();
    renderProjects();
    showToast((isNew ? 'Project created' : 'Project saved') + ' (' + images.length + ' media items)');
  });
}

function closeModal() {
  var overlay = document.querySelector('.admin-modal-overlay');
  if (overlay) overlay.remove();
  editingProjectId = null;
}

/* ============================================================
   PROJECT DETAIL PAGE
   ============================================================ */
function renderProjectDetail() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) { var h1 = document.querySelector('.project-header h1'); if (h1) h1.textContent = 'Project not found'; return; }
  var proj = getProject(id);
  if (!proj) { var h1 = document.querySelector('.project-header h1'); if (h1) h1.textContent = 'Project not found'; return; }
  document.title = proj.title + ' | Seif Aldeen';

  var headerEl = document.querySelector('.project-header h1');
  var labelEl = document.querySelector('.project-header .card-label');
  var tagsEl = document.querySelector('.project-header .tag-list');
  if (headerEl) headerEl.textContent = proj.title;
  if (labelEl) labelEl.textContent = proj.label;
  if (tagsEl) tagsEl.innerHTML = proj.tags.map(function(t) { return '<li>' + escHtml(t) + '</li>'; }).join('');

  var mediaContainer = document.querySelector('.media-container');
  var heroImg = mediaContainer ? mediaContainer.querySelector('img') : null;
  var heroIframe = mediaContainer ? mediaContainer.querySelector('iframe') : null;
  var existingFallback = mediaContainer ? mediaContainer.querySelector('.media-fallback') : null;
  if (existingFallback) existingFallback.remove();

  if (mediaContainer && proj.images.length > 0) {
    var firstType = proj.images[0].type || detectMediaType(proj.images[0].src);
    if (firstType === 'video') {
      if (heroImg) heroImg.style.display = 'none';
      if (!heroIframe) {
        heroIframe = document.createElement('iframe');
        heroIframe.setAttribute('frameborder', '0');
        heroIframe.setAttribute('allowfullscreen', 'true');
        heroIframe.setAttribute('allow', 'autoplay; encrypted-media');
        heroIframe.style.cssText = 'width:100%;aspect-ratio:16/9;display:block;border:none;border-radius:12px;';
        mediaContainer.insertBefore(heroIframe, mediaContainer.firstChild);
        heroIframe = mediaContainer.querySelector('iframe');
      }
      heroIframe.src = getEmbedUrl(proj.images[0].src);
      heroIframe.style.display = 'block';
    } else {
      if (heroIframe) heroIframe.style.display = 'none';
      if (heroImg) { heroImg.src = proj.images[0].src; heroImg.alt = proj.images[0].alt || proj.title; heroImg.style.display = 'block'; }
    }
  } else if (heroImg) {
    heroImg.style.display = 'none';
    if (heroIframe) heroIframe.style.display = 'none';
    if (mediaContainer && !mediaContainer.querySelector('.media-fallback')) {
      var fb = document.createElement('div');
      fb.className = 'media-fallback';
      fb.innerHTML = '<span style="font-size:2rem;opacity:0.3;">\uD83D\uDDBC</span><p>No media yet. Add some in dev mode.</p>';
      mediaContainer.appendChild(fb);
    }
  }

  var overviewEl = document.getElementById('detailOverview');
  if (overviewEl) overviewEl.textContent = proj.detail.overview || 'No overview provided yet.';
  var roleEl = document.getElementById('detailRole');
  if (roleEl) roleEl.textContent = proj.detail.role || 'No details provided yet.';

  renderDetailSection('detailHighlights', 'Technical Highlights', proj.detail.highlights, true);
  renderDetailSection('detailChallenges', 'Challenges & Problem Solving', proj.detail.challenges);
  renderDetailSection('detailResults', 'Results', proj.detail.results);
  renderDetailSection('detailTechnologies', 'Technologies Used', proj.detail.technologies);

  var gallery = document.getElementById('photoGallery');
  if (gallery) {
    gallery.innerHTML = '';
    proj.images.forEach(function(media, i) {
      if (i === 0) return;
      var type = media.type || detectMediaType(media.src);
      var figure = document.createElement('figure');
      figure.className = 'gallery-figure';
      if (type === 'video') {
        var iframe = document.createElement('iframe');
        iframe.src = getEmbedUrl(media.src);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.style.cssText = 'width:100%;aspect-ratio:16/9;display:block;border:none;';
        figure.appendChild(iframe);
        var playBadge = document.createElement('div');
        playBadge.className = 'gallery-play-badge';
        playBadge.textContent = '\u25B6';
        figure.appendChild(playBadge);
      } else {
        var el = document.createElement('img');
        el.src = media.src;
        el.alt = media.alt || 'Project image ' + i;
        el.loading = 'lazy';
        figure.appendChild(el);
      }
      var caption = document.createElement('figcaption');
      caption.className = 'gallery-caption';
      caption.textContent = media.alt || (type === 'video' ? 'Video ' + i : 'Image ' + i);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
    if (proj.images.length <= 1) gallery.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">No additional media yet.</p>';
  }

  lightboxImages = proj.images;

  if (mediaContainer) {
    mediaContainer.querySelectorAll('img, iframe').forEach(function(el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() {
        var src = el.src || el.getAttribute('src') || '';
        var idx = lightboxImages.findIndex(function(x) { return x.src === src || getEmbedUrl(x.src) === src; });
        if (idx >= 0) {
          var itemType = lightboxImages[idx].type || detectMediaType(lightboxImages[idx].src);
          if (itemType === 'video') window.open(lightboxImages[idx].src, '_blank');
          else if (idx === 0) openLightbox(0);
        }
      });
    });
  }

  if (gallery) {
    gallery.querySelectorAll('.gallery-figure').forEach(function(fig) {
      fig.style.cursor = 'pointer';
      fig.addEventListener('click', function() {
        var iframe = fig.querySelector('iframe');
        var img = fig.querySelector('img');
        var src = iframe ? iframe.getAttribute('src') : (img ? img.src : '');
        var idx = lightboxImages.findIndex(function(x) { return x.src === src || getEmbedUrl(x.src) === src; });
        if (idx >= 0) {
          var itemType = lightboxImages[idx].type || detectMediaType(lightboxImages[idx].src);
          if (itemType === 'video') window.open(lightboxImages[idx].src, '_blank');
          else openLightbox(idx);
        }
      });
    });
  }

  if (isDevMode) {
    var header = document.querySelector('.project-header');
    if (header && !document.getElementById('detailEditBtn')) {
      var editBtn = document.createElement('div');
      editBtn.style.cssText = 'margin-top:20px;';
      editBtn.innerHTML = '<button class="admin-btn" id="detailEditBtn" style="padding:8px 20px;font-size:0.9rem;">\u270E\u00a0Edit This Project</button>';
      header.appendChild(editBtn);
      document.getElementById('detailEditBtn').addEventListener('click', function() { openEditor(id); });
    }
  }
}

function renderDetailSection(id, label, content, isList) {
  var container = document.getElementById(id);
  if (!container) return;
  if (!content || !content.trim()) { container.style.display = 'none'; return; }
  container.style.display = '';
  var heading = container.querySelector('h2');
  if (heading) heading.textContent = label;
  var body = container.querySelector('.detail-body');
  if (!body) return;
  if (isList) {
    var lines = content.replace(/\r\n/g, '\n').split('\n').filter(Boolean);
    body.innerHTML = '<ul class="detail-list">' + lines.map(function(l) { return '<li>' + escHtml(l.trim()) + '</li>'; }).join('') + '</ul>';
  } else {
    body.textContent = content;
  }
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(index) {
  lightboxIndex = index;
  var overlay = document.getElementById('lightbox');
  var img = document.getElementById('lightboxImg');
  var counter = document.getElementById('lightboxCounter');
  if (!overlay || !img) return;
  if (lightboxImages.length === 0) return;
  var item = lightboxImages[index];
  var itemType = item.type || detectMediaType(item.src);
  if (itemType === 'video') { window.open(item.src, '_blank'); return; }
  img.src = item.src;
  img.alt = item.alt || '';
  counter.textContent = (index + 1) + ' / ' + lightboxImages.length;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function findImageIndex(start, dir) {
  var len = lightboxImages.length;
  for (var i = 1; i < len; i++) {
    var idx = (start + dir * i + len) % len;
    var t = lightboxImages[idx].type || detectMediaType(lightboxImages[idx].src);
    if (t !== 'video') return idx;
  }
  return -1;
}

function lightboxPrev() {
  if (lightboxImages.length === 0) return;
  var next = findImageIndex(lightboxIndex, -1);
  if (next < 0) return;
  lightboxIndex = next;
  var img = document.getElementById('lightboxImg');
  var counter = document.getElementById('lightboxCounter');
  if (img) img.src = lightboxImages[next].src;
  if (counter) counter.textContent = (next + 1) + ' / ' + lightboxImages.length;
}

function lightboxNext() {
  if (lightboxImages.length === 0) return;
  var next = findImageIndex(lightboxIndex, 1);
  if (next < 0) return;
  lightboxIndex = next;
  var img = document.getElementById('lightboxImg');
  var counter = document.getElementById('lightboxCounter');
  if (img) img.src = lightboxImages[next].src;
  if (counter) counter.textContent = (next + 1) + ' / ' + lightboxImages.length;
}

function initLightboxUI() {
  var overlay = document.getElementById('lightbox');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  if (!overlay) return;
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', lightboxPrev);
  if (nextBtn) nextBtn.addEventListener('click', lightboxNext);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });
}

function initScrollProgress() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  isDevMode = new URLSearchParams(window.location.search).get('dev') === DEV_SECRET;
  setYear();
  initHeaderScroll();
  initHamburger();
  setupFadeObserver();
  observeFadeElements();
  initLightboxUI();
  initScrollProgress();
  loadData(function() {
    loadPageContent(function() {
      renderSectionContent();
      if (document.getElementById('projectGrid')) renderProjects();
      if (document.querySelector('.project-page')) renderProjectDetail();
      if (isDevMode) { initAdminPanel(); initSectionEditors(); }
    });
  });
});
