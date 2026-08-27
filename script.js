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

const PAGE_KEY = 'portfolio_page';

let projects = [];
let isDevMode = false;
let editingProjectId = null;
let lightboxImages = [];
let lightboxIndex = 0;
let fadeObserver = null;
let pageContent = null;
let adminGitHubToken = '';
let adminGitHubRepo = 'seif-aldeen/seif-aldeen.github.io';
let adminGitHubBranch = 'main';
let adminDirty = false;
let currentProjectFilter = 'All';

function normalizeCoverSettings(project) {
  var source = project.coverSettings || {};
  var clamp = function(value, min, max, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
  };
  return {
    focusX: clamp(source.focusX, 0, 100, 50),
    focusY: clamp(source.focusY, 0, 100, 50),
    zoom: clamp(source.zoom, 1, 2.5, 1)
  };
}

function sanitizeProjects() {
  projects.forEach(function(p) {
    if (p.images) p.images = p.images.filter(function(img) { return img.src && img.src.indexOf('via.placeholder') === -1; });
    if (!p.detail) p.detail = {};
    if (!p.detail.highlights) p.detail.highlights = '';
    if (!p.detail.milestones) p.detail.milestones = '';
    if (!p.detail.deliverables) p.detail.deliverables = '';
    if (!p.detail.challenges) p.detail.challenges = '';
    if (!p.detail.results) p.detail.results = '';
    if (!p.detail.technologies) p.detail.technologies = '';
    if (!p.detail.objective) p.detail.objective = '';
    if (!p.detail.decisions) p.detail.decisions = '';
    p.coverSettings = normalizeCoverSettings(p);
    p.featured = Boolean(p.featured);
    p.hidden = Boolean(p.hidden);
    p.approvalPending = Boolean(p.approvalPending);
    p.status = p.status || '';
    p.statusTone = p.statusTone || 'neutral';
    p.categories = Array.isArray(p.categories) ? p.categories.filter(Boolean) : [];
    if (!p.rating) p.rating = '';
    if (!p.reviewTitle) p.reviewTitle = '';
    if (!p.reviewText) p.reviewText = '';
    if (!p.reviewDate) p.reviewDate = '';
  });
}

async function loadData(callback) {
  if (Array.isArray(window.PORTFOLIO_DATA)) {
    projects = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));
    sanitizeProjects();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch (_) {}
    if (location.protocol === 'file:') {
      if (callback) callback();
      return;
    }
  }
  try {
    var response = await fetch('portfolio-data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Portfolio data request failed');
    projects = await response.json();
    if (!Array.isArray(projects)) throw new Error('Portfolio data is invalid');
    sanitizeProjects();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch (_) {}
  } catch (error) {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      projects = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    } catch (_) { projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS)); }
    sanitizeProjects();
    console.warn('Using cached portfolio data.', error);
  }
  if (callback) callback();
}

function saveData(callback) {
  adminDirty = true;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch (_) {}
  updateAdminPublishState();
  if (callback) callback('');
}

async function loadPageContent(callback) {
  pageContent = window.PORTFOLIO_PAGE_CONTENT && typeof window.PORTFOLIO_PAGE_CONTENT === 'object'
    ? JSON.parse(JSON.stringify(window.PORTFOLIO_PAGE_CONTENT))
    : {};
  if (location.protocol === 'file:') {
    if (callback) callback();
    return;
  }
  try {
    var response = await fetch('site-content.json', { cache: 'no-store' });
    pageContent = response.ok ? await response.json() : {};
  } catch (_) { pageContent = {}; }
  if (!pageContent) pageContent = {};
  if (callback) callback();
}

function savePageContent(callback) {
  adminDirty = true;
  try { localStorage.setItem(PAGE_KEY, JSON.stringify(pageContent)); } catch (_) {}
  updateAdminPublishState();
  if (callback) callback(true);
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
  grid.setAttribute('aria-busy', 'false');
  grid.innerHTML = '';
  grid.className = 'project-browser';

  var availableProjects = projects.filter(function(project) { return isDevMode || !project.hidden; });
  var categories = ['All'];
  availableProjects.forEach(function(project) {
    (project.categories || []).forEach(function(category) {
      if (categories.indexOf(category) === -1) categories.push(category);
    });
  });
  if (categories.indexOf(currentProjectFilter) === -1) currentProjectFilter = 'All';

  var filters = document.createElement('div');
  filters.className = 'project-filters';
  filters.setAttribute('aria-label', 'Filter projects');
  categories.forEach(function(category) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-filter' + (category === currentProjectFilter ? ' active' : '');
    button.textContent = category;
    button.setAttribute('aria-pressed', category === currentProjectFilter ? 'true' : 'false');
    button.addEventListener('click', function() { currentProjectFilter = category; renderProjects(); });
    filters.appendChild(button);
  });
  grid.appendChild(filters);

  var matches = function(project) {
    return currentProjectFilter === 'All' || (project.categories || []).indexOf(currentProjectFilter) !== -1;
  };
  var featured = availableProjects.filter(function(project) { return project.featured && matches(project); });
  var more = availableProjects.filter(function(project) { return !project.featured && matches(project); });

  function createProjectCard(proj) {
    var card = document.createElement('a');
    card.href = 'project.html?id=' + encodeURIComponent(proj.id);
    card.className = 'work-card fade-in' + (proj.hidden ? ' admin-hidden-project' : '');
    card.dataset.projectId = proj.id;
    var overlay = '';
    if (isDevMode) {
      overlay = '<div class="edit-overlay"><button class="admin-edit-btn" data-id="' + proj.id + '" data-action="edit">\u270E\u00a0Edit</button><span class="admin-drag-hint">Drag to reorder</span><button class="admin-del-btn" data-id="' + proj.id + '" title="Delete project">&times;</button></div>';
    }
    var coverHtml = '';
    if (proj.images && proj.images.length > 0 && proj.images[0].src) {
      var framing = normalizeCoverSettings(proj);
      var firstType = proj.images[0].type || detectMediaType(proj.images[0].src);
      var coverStyle = 'object-position:' + framing.focusX + '% ' + framing.focusY + '%;transform:scale(' + framing.zoom + ');transform-origin:' + framing.focusX + '% ' + framing.focusY + '%;';
      var coverImg = '<img class="card-cover" src="' + escHtml(proj.images[0].src) + '" alt="' + escHtml(proj.title) + '" loading="lazy" style="' + coverStyle + '">';
      coverHtml = '<div class="card-cover-viewport">' + coverImg + (firstType === 'video' ? '<span class="card-cover-play">\u25B6</span>' : '') + '</div>';
    }
    var ratingHtml = proj.rating ? '<span class="project-rating" aria-label="' + escHtml(proj.rating) + ' out of 5 client rating"><strong>\u2605 ' + escHtml(proj.rating) + '</strong><span>Upwork client review</span></span>' : '';
    var statusHtml = '<span class="project-status status-' + escHtml(proj.statusTone || 'complete') + '">' + escHtml(proj.status || 'Project') + '</span>';
    var hiddenHtml = proj.hidden ? '<span class="project-hidden-badge">Hidden</span>' : '';
    card.innerHTML = overlay + '<div class="project-cover-shell">' + coverHtml + statusHtml + hiddenHtml + '<span class="view-case-study">View Case Study \u2192</span></div><div class="card-content"><span class="card-label">' + escHtml(proj.label) + '</span>' + ratingHtml + '<h3>' + escHtml(proj.title) + '</h3><p>' + escHtml(proj.description) + '</p><ul class="tag-list">' + proj.tags.slice(0, 5).map(function(t) { return '<li>' + escHtml(t) + '</li>'; }).join('') + '</ul></div>';
    if (isDevMode) {
      card.addEventListener('click', function(e) { e.preventDefault(); openEditor(proj.id); });
      card.addEventListener('mouseenter', function() { var o = card.querySelector('.edit-overlay'); if (o) o.style.opacity = '1'; });
      card.addEventListener('mouseleave', function() { var o = card.querySelector('.edit-overlay'); if (o) o.style.opacity = ''; });
      var deleteButton = card.querySelector('.admin-del-btn');
      if (deleteButton) deleteButton.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); deleteProject(proj.id); });
      card.draggable = true;
      card.addEventListener('dragstart', function(e) { e.dataTransfer.setData('text/plain', proj.id); card.classList.add('dragging'); });
      card.addEventListener('dragend', function() { card.classList.remove('dragging'); });
      card.addEventListener('dragover', function(e) { e.preventDefault(); });
      card.addEventListener('drop', function(e) {
        e.preventDefault(); e.stopPropagation();
        var sourceId = e.dataTransfer.getData('text/plain');
        if (!sourceId || sourceId === proj.id) return;
        var from = projects.findIndex(function(item) { return item.id === sourceId; });
        var to = projects.findIndex(function(item) { return item.id === proj.id; });
        if (from < 0 || to < 0) return;
        var moved = projects.splice(from, 1)[0];
        projects.splice(to, 0, moved);
        saveData(function() { renderProjects(); showToast('Project order updated'); });
      });
    }
    return card;
  }

  function appendGroup(title, description, groupProjects, className) {
    if (!groupProjects.length) return;
    var section = document.createElement('section');
    section.className = 'project-group ' + className;
    var heading = document.createElement('div');
    heading.className = 'project-group-heading';
    heading.innerHTML = '<div><h3>' + escHtml(title) + '</h3><p>' + escHtml(description) + '</p></div><span>' + groupProjects.length + ' project' + (groupProjects.length === 1 ? '' : 's') + '</span>';
    var cards = document.createElement('div');
    cards.className = 'work-grid';
    groupProjects.forEach(function(project) { cards.appendChild(createProjectCard(project)); });
    section.appendChild(heading);
    section.appendChild(cards);
    grid.appendChild(section);
  }

  appendGroup('Featured Case Studies', 'The strongest evidence of client delivery, manufacturing release, and verified engineering work.', featured, 'featured-projects');

  if (more.length) {
    var moreDetails = document.createElement('details');
    moreDetails.className = 'more-projects-panel';
    moreDetails.open = isDevMode || currentProjectFilter !== 'All';
    var summary = document.createElement('summary');
    summary.innerHTML = '<span><strong>More Engineering Projects</strong><small>Robotics, electronics, competition systems, and earlier builds</small></span><span class="more-project-count">' + more.length + ' projects</span>';
    var moreGrid = document.createElement('div');
    moreGrid.className = 'work-grid more-projects-grid';
    more.forEach(function(project) { moreGrid.appendChild(createProjectCard(project)); });
    moreDetails.appendChild(summary);
    moreDetails.appendChild(moreGrid);
    grid.appendChild(moreDetails);
  }

  if (!featured.length && !more.length) {
    var empty = document.createElement('p');
    empty.className = 'project-filter-empty';
    empty.textContent = 'No projects match this filter.';
    grid.appendChild(empty);
  }
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

function encodeUtf8Base64(text) {
  var bytes = new TextEncoder().encode(text);
  var binary = '';
  bytes.forEach(function(byte) { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function githubPutFile(filePath, contentBase64, message) {
  var safePath = filePath.split('/').map(encodeURIComponent).join('/');
  var endpoint = 'https://api.github.com/repos/' + adminGitHubRepo + '/contents/' + safePath;
  var headers = { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + adminGitHubToken, 'X-GitHub-Api-Version': '2022-11-28' };
  var existing = await fetch(endpoint + '?ref=' + encodeURIComponent(adminGitHubBranch), { headers: headers });
  var sha = existing.ok ? (await existing.json()).sha : null;
  var body = { message: message, content: contentBase64, branch: adminGitHubBranch };
  if (sha) body.sha = sha;
  var response = await fetch(endpoint, { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, headers), body: JSON.stringify(body) });
  if (!response.ok) {
    var detail = await response.text();
    throw new Error('GitHub rejected ' + filePath + ' (' + response.status + '): ' + detail.slice(0, 220));
  }
}

async function publishAdminChanges() {
  if (!adminGitHubToken) { showGitHubConnectModal(); return; }
  var pendingProjects = projects.filter(function(project) { return project.approvalPending && !project.hidden; });
  if (pendingProjects.length && !confirm('Publication check: ' + pendingProjects.length + ' visible project(s) are still marked approval pending:\n\n' + pendingProjects.map(function(project) { return '• ' + project.title; }).join('\n') + '\n\nPublish anyway?')) return;
  if (!confirm('Publish the current portfolio changes to ' + adminGitHubRepo + ' on branch ' + adminGitHubBranch + '? This creates GitHub commits and updates the live site automatically.')) return;
  var publishButton = document.getElementById('adminPublish');
  publishButton.disabled = true;
  publishButton.textContent = 'Publishing…';
  try {
    for (var p = 0; p < projects.length; p++) {
      var project = projects[p];
      for (var i = 0; i < (project.images || []).length; i++) {
        var media = project.images[i];
        var match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(media.src || '');
        if (!match) continue;
        var ext = match[1] === 'image/png' ? 'png' : match[1] === 'image/webp' ? 'webp' : 'jpg';
        var mediaPath = 'assets/projects/' + project.id + '/upload-' + Date.now() + '-' + (i + 1) + '.' + ext;
        await githubPutFile(mediaPath, match[2], 'Add media for ' + project.title);
        media.src = mediaPath;
      }
    }
    var pageKeys = Object.keys(pageContent || {});
    for (var k = 0; k < pageKeys.length; k++) {
      var key = pageKeys[k];
      var pageMatch = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(pageContent[key] || '');
      if (!pageMatch) continue;
      var pageExt = pageMatch[1] === 'image/png' ? 'png' : pageMatch[1] === 'image/webp' ? 'webp' : 'jpg';
      var pagePath = 'assets/site/' + key.replace(/[^a-z0-9_-]/gi, '-') + '-' + Date.now() + '.' + pageExt;
      await githubPutFile(pagePath, pageMatch[2], 'Update portfolio image ' + key);
      pageContent[key] = pagePath;
    }
    await githubPutFile('portfolio-data.json', encodeUtf8Base64(JSON.stringify(projects, null, 2) + '\n'), 'Update portfolio projects');
    await githubPutFile('portfolio-data.js', encodeUtf8Base64('window.PORTFOLIO_DATA = ' + JSON.stringify(projects, null, 2) + ';\n'), 'Update direct-open project fallback');
    await githubPutFile('site-content.json', encodeUtf8Base64(JSON.stringify(pageContent || {}, null, 2) + '\n'), 'Update portfolio page content');
    await githubPutFile('site-content.js', encodeUtf8Base64('window.PORTFOLIO_PAGE_CONTENT = ' + JSON.stringify(pageContent || {}, null, 2) + ';\n'), 'Update direct-open page fallback');
    adminDirty = false;
    updateAdminPublishState();
    renderProjects();
    showToast('Published successfully. GitHub Pages will update automatically.');
  } catch (error) {
    console.error(error);
    showToast(error.message || 'Publish failed');
  } finally {
    publishButton.disabled = false;
    publishButton.textContent = adminDirty ? 'Publish changes' : 'Published';
  }
}

function updateAdminPublishState() {
  var button = document.getElementById('adminPublish');
  if (!button) return;
  button.textContent = adminDirty ? 'Publish changes' : 'No unpublished changes';
  button.classList.toggle('admin-btn-success', adminDirty);
}

function showGitHubConnectModal() {
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = '<div class="admin-modal" style="max-width:620px"><div class="admin-modal-header"><h2>Connect GitHub</h2><button class="admin-modal-close" id="githubClose">&times;</button></div><div class="admin-modal-body"><p style="color:var(--text-muted)">Use a fine-grained token restricted to this repository with Contents read/write. The token stays in memory and is never stored in the site.</p><div class="admin-field"><label>Repository</label><input class="admin-input" id="githubRepo" value="' + escHtml(adminGitHubRepo) + '"></div><div class="admin-field"><label>Branch</label><input class="admin-input" id="githubBranch" value="' + escHtml(adminGitHubBranch) + '"></div><div class="admin-field"><label>Fine-grained token</label><input class="admin-input" type="password" id="githubToken" autocomplete="off" spellcheck="false"></div></div><div class="admin-modal-footer"><button class="button button-secondary" id="githubCancel">Cancel</button><button class="button button-primary" id="githubConnectSave">Connect</button></div></div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  document.getElementById('githubClose').addEventListener('click', close);
  document.getElementById('githubCancel').addEventListener('click', close);
  document.getElementById('githubConnectSave').addEventListener('click', async function() {
    var token = document.getElementById('githubToken').value.trim();
    var repo = document.getElementById('githubRepo').value.trim();
    var branch = document.getElementById('githubBranch').value.trim();
    if (!token || !repo || !branch) { showToast('Repository, branch, and token are required.'); return; }
    this.disabled = true; this.textContent = 'Checking…';
    try {
      var response = await fetch('https://api.github.com/repos/' + repo, { headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token, 'X-GitHub-Api-Version': '2022-11-28' } });
      if (!response.ok) throw new Error('GitHub connection failed (' + response.status + ')');
      adminGitHubToken = token; adminGitHubRepo = repo; adminGitHubBranch = branch;
      document.getElementById('adminConnect').textContent = 'GitHub connected';
      close(); showToast('GitHub connected for this browser tab.');
    } catch (error) { showToast(error.message); this.disabled = false; this.textContent = 'Connect'; }
  });
}

function initAdminPanel() {
  isDevMode = true;
  document.body.classList.add('dev-mode');
  renderProjects();
  var bar = document.createElement('div');
  bar.className = 'admin-bar';
  bar.innerHTML = '<div class="admin-bar-badge">Admin preview</div><div class="admin-bar-actions"><button class="admin-btn" id="adminConnect">Connect GitHub</button><button class="admin-btn" id="adminPublish">No unpublished changes</button><button class="admin-btn admin-btn-danger" id="adminExit">Exit admin</button></div>';
  document.body.appendChild(bar);
  document.getElementById('adminConnect').addEventListener('click', showGitHubConnectModal);
  document.getElementById('adminPublish').addEventListener('click', publishAdminChanges);
  document.getElementById('adminExit').addEventListener('click', function() {
    var url = new URL(window.location); url.searchParams.delete('admin'); window.location.href = url.toString();
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
    } else if (['P', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'STRONG', 'BLOCKQUOTE', 'LI', 'DIV'].indexOf(el.tagName) !== -1) {
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
  var proj = isNew ? { id: '', label: '', title: '', description: '', tags: [], categories: [], featured: false, hidden: true, approvalPending: true, status: 'Draft', statusTone: 'neutral', images: [], coverSettings: { focusX: 50, focusY: 50, zoom: 1 }, rating: '', reviewTitle: '', reviewText: '', reviewDate: '', detail: { overview: '', objective: '', role: '', highlights: '', milestones: '', decisions: '', deliverables: '', challenges: '', results: '', technologies: '' } } : JSON.parse(JSON.stringify(getProject(projectId)));
  var coverSettings = normalizeCoverSettings(proj);
  var coverSource = proj.images && proj.images[0] && (proj.images[0].type || detectMediaType(proj.images[0].src)) !== 'video' ? proj.images[0].src : '';
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';

  var imagesHTML = renderImageListHTML(proj.images);
  overlay.innerHTML = '<div class="admin-modal"><div class="admin-modal-header"><h2>' + (isNew ? 'New Project' : 'Edit Project') + '</h2><button class="admin-modal-close" id="modalClose">&times;</button></div><div class="admin-modal-body">' +
    '<div class="admin-field"><label>Project ID</label><input class="admin-input" id="edit-id" value="' + escHtml(proj.id) + '" ' + (isNew ? '' : 'readonly style="opacity:0.6"') + '></div>' +
    '<div class="admin-field"><label>Category Label</label><input class="admin-input" id="edit-label" value="' + escHtml(proj.label) + '"></div>' +
    '<div class="admin-field"><label>Title</label><input class="admin-input" id="edit-title" value="' + escHtml(proj.title) + '"></div>' +
    '<div class="admin-field"><label>Description</label><textarea class="admin-input" id="edit-desc" rows="3">' + escHtml(proj.description) + '</textarea></div>' +
    '<div class="admin-field"><label>Tags</label><input class="admin-input" id="edit-tags" value="' + escHtml(proj.tags.join(', ')) + '"></div>' +
    '<div class="admin-field"><label>Homepage Filters</label><input class="admin-input" id="edit-categories" value="' + escHtml((proj.categories || []).join(', ')) + '" placeholder="PCB Design, Embedded Systems"></div>' +
    '<div class="admin-field"><label>Validation Status</label><input class="admin-input" id="edit-status" value="' + escHtml(proj.status || '') + '" placeholder="In Production - Bring-up Pending"></div>' +
    '<div class="admin-field"><label>Status Color</label><select class="admin-input" id="edit-status-tone"><option value="neutral"' + (proj.statusTone === 'neutral' ? ' selected' : '') + '>Neutral</option><option value="progress"' + (proj.statusTone === 'progress' ? ' selected' : '') + '>In progress</option><option value="success"' + (proj.statusTone === 'success' ? ' selected' : '') + '>Validated / accepted</option><option value="warning"' + (proj.statusTone === 'warning' ? ' selected' : '') + '>Pending / pre-fabrication</option></select></div>' +
    '<div class="admin-check-grid"><label><input type="checkbox" id="edit-featured"' + (proj.featured ? ' checked' : '') + '> Featured case study</label><label><input type="checkbox" id="edit-hidden"' + (proj.hidden ? ' checked' : '') + '> Hide from public site</label><label><input type="checkbox" id="edit-approval"' + (proj.approvalPending ? ' checked' : '') + '> Publication approval pending</label></div>' +
    '<div class="admin-field"><label>Upwork Rating (leave blank if none)</label><input class="admin-input" id="edit-rating" value="' + escHtml(proj.rating || '') + '" placeholder="5.0"></div>' +
    '<div class="admin-field"><label>Review Project Title</label><input class="admin-input" id="edit-review-title" value="' + escHtml(proj.reviewTitle || '') + '"></div>' +
    '<div class="admin-field"><label>Review Date</label><input class="admin-input" id="edit-review-date" value="' + escHtml(proj.reviewDate || '') + '"></div>' +
    '<div class="admin-field"><label>Client Review</label><textarea class="admin-input" id="edit-review-text" rows="3">' + escHtml(proj.reviewText || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Overview</label><textarea class="admin-input" id="edit-overview" rows="4">' + escHtml(proj.detail.overview) + '</textarea></div>' +
    '<div class="admin-field"><label>Project Objective</label><textarea class="admin-input" id="edit-objective" rows="3">' + escHtml(proj.detail.objective || '') + '</textarea></div>' +
    '<div class="admin-field"><label>My Role</label><textarea class="admin-input" id="edit-role" rows="4">' + escHtml(proj.detail.role) + '</textarea></div>' +
    '<div class="admin-field"><label>Technical Highlights</label><textarea class="admin-input" id="edit-highlights" rows="4">' + escHtml(proj.detail.highlights || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Milestones &amp; Handoffs</label><textarea class="admin-input" id="edit-milestones" rows="6">' + escHtml(proj.detail.milestones || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Engineering Decisions</label><textarea class="admin-input" id="edit-decisions" rows="5">' + escHtml(proj.detail.decisions || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Selected Deliverables &amp; Evidence</label><textarea class="admin-input" id="edit-deliverables" rows="5">' + escHtml(proj.detail.deliverables || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Challenges</label><textarea class="admin-input" id="edit-challenges" rows="4">' + escHtml(proj.detail.challenges || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Results</label><textarea class="admin-input" id="edit-results" rows="3">' + escHtml(proj.detail.results || '') + '</textarea></div>' +
    '<div class="admin-field"><label>Technologies Used</label><input class="admin-input" id="edit-technologies" value="' + escHtml(proj.detail.technologies || '') + '"></div>' +
    '<div class="admin-field"><label>Images &amp; Videos</label><div class="image-sortable-list" id="imageSortableList">' + imagesHTML + '</div>' +
    '<div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap;"><input class="admin-input" id="addImageUrl" placeholder="Image URL..." style="flex:2;min-width:120px;font-size:0.8rem;"><button class="admin-btn" id="addImageBtn">+ Image URL</button></div>' +
    '<div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap;"><input class="admin-input" id="addVideoUrl" placeholder="Google Drive / YouTube URL..." style="flex:2;min-width:120px;font-size:0.8rem;"><button class="admin-btn" id="addVideoBtn">+ Video</button></div>' +
    '<div style="margin:6px 0;"><label class="admin-btn admin-btn-upload" for="fileInput">Upload Images</label><input type="file" id="fileInput" accept="image/*" multiple style="display:none;"></div>' +
    '</div>' +
    '<div class="admin-field"><label>Homepage Cover Framing</label><p style="color:var(--text-muted);font-size:0.8rem;margin:4px 0 8px;">Choose the cover with the star above, then adjust how it appears on the homepage.</p><div class="cover-adjust-preview"><img id="coverAdjustPreview" src="' + escHtml(coverSource) + '" alt="Homepage cover preview"></div><div class="cover-adjust-controls"><label>Horizontal <input type="range" id="coverFocusX" min="0" max="100" step="1" value="' + coverSettings.focusX + '"><span id="coverFocusXValue">' + coverSettings.focusX + '%</span></label><label>Vertical <input type="range" id="coverFocusY" min="0" max="100" step="1" value="' + coverSettings.focusY + '"><span id="coverFocusYValue">' + coverSettings.focusY + '%</span></label><label>Zoom <input type="range" id="coverZoom" min="1" max="2.5" step="0.05" value="' + coverSettings.zoom + '"><span id="coverZoomValue">' + coverSettings.zoom + '×</span></label></div></div>' +
    '<div class="admin-modal-footer">' + (isNew ? '' : '<button class="button button-danger" id="modalDelete">\u2716\u00a0Delete</button><button class="button button-secondary" id="modalDuplicate">Duplicate</button>') + '<button class="button button-secondary" id="modalCancel">Cancel</button><button class="button button-primary" id="modalSave">' + (isNew ? 'Create Project' : 'Save Changes') + '</button></div></div>';
  document.body.appendChild(overlay);

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  overlay.addEventListener('keydown', function(e) { if ((e.key === 'Enter') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveEdit(isNew); } if (e.key === 'Escape') closeModal(); });
  document.getElementById('modalSave').addEventListener('click', function() { saveEdit(isNew); });
  var delBtn = document.getElementById('modalDelete');
  if (delBtn) delBtn.addEventListener('click', function() { var id = document.getElementById('edit-id').value.trim(); closeModal(); deleteProject(id); });
  var duplicateBtn = document.getElementById('modalDuplicate');
  if (duplicateBtn) duplicateBtn.addEventListener('click', function() { duplicateProject(projectId); });

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
  wireCoverControls();
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

function updateCoverPreviewSource() {
  var preview = document.getElementById('coverAdjustPreview');
  if (!preview) return;
  var media = getMediaItems()[0];
  if (!media || (media.type || detectMediaType(media.src)) === 'video') {
    preview.removeAttribute('src');
    preview.alt = 'Choose an image as the project cover';
    return;
  }
  preview.src = media.src;
  preview.alt = media.alt || 'Homepage cover preview';
}

function wireCoverControls() {
  var preview = document.getElementById('coverAdjustPreview');
  var x = document.getElementById('coverFocusX');
  var y = document.getElementById('coverFocusY');
  var zoom = document.getElementById('coverZoom');
  if (!preview || !x || !y || !zoom) return;
  var update = function() {
    preview.style.objectPosition = x.value + '% ' + y.value + '%';
    preview.style.transform = 'scale(' + zoom.value + ')';
    preview.style.transformOrigin = x.value + '% ' + y.value + '%';
    document.getElementById('coverFocusXValue').textContent = x.value + '%';
    document.getElementById('coverFocusYValue').textContent = y.value + '%';
    document.getElementById('coverZoomValue').textContent = Number(zoom.value).toFixed(2).replace(/\.00$/, '') + '\u00D7';
  };
  x.addEventListener('input', update);
  y.addEventListener('input', update);
  zoom.addEventListener('input', update);
  update();
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
  updateCoverPreviewSource();
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
    categories: document.getElementById('edit-categories').value.trim().split(',').map(function(t) { return t.trim(); }).filter(Boolean),
    featured: document.getElementById('edit-featured').checked,
    hidden: document.getElementById('edit-hidden').checked,
    approvalPending: document.getElementById('edit-approval').checked,
    status: document.getElementById('edit-status').value.trim(),
    statusTone: document.getElementById('edit-status-tone').value,
    images: images,
    coverSettings: {
      focusX: Number(document.getElementById('coverFocusX').value),
      focusY: Number(document.getElementById('coverFocusY').value),
      zoom: Number(document.getElementById('coverZoom').value)
    },
    rating: document.getElementById('edit-rating').value.trim(),
    reviewTitle: document.getElementById('edit-review-title').value.trim(),
    reviewDate: document.getElementById('edit-review-date').value.trim(),
    reviewText: document.getElementById('edit-review-text').value.trim(),
    detail: {
      overview: document.getElementById('edit-overview').value.trim(),
      objective: document.getElementById('edit-objective').value.trim(),
      role: document.getElementById('edit-role').value.trim(),
      highlights: document.getElementById('edit-highlights').value.trim(),
      milestones: document.getElementById('edit-milestones').value.trim(),
      decisions: document.getElementById('edit-decisions').value.trim(),
      deliverables: document.getElementById('edit-deliverables').value.trim(),
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
      proj.categories = data.categories;
      proj.featured = data.featured;
      proj.hidden = data.hidden;
      proj.approvalPending = data.approvalPending;
      proj.status = data.status;
      proj.statusTone = data.statusTone;
      proj.images = data.images;
      proj.coverSettings = data.coverSettings;
      proj.rating = data.rating;
      proj.reviewTitle = data.reviewTitle;
      proj.reviewDate = data.reviewDate;
      proj.reviewText = data.reviewText;
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

function duplicateProject(projectId) {
  var original = getProject(projectId);
  if (!original) return;
  var clone = JSON.parse(JSON.stringify(original));
  var base = original.id + '-copy';
  var nextId = base;
  var suffix = 2;
  while (getProject(nextId)) { nextId = base + '-' + suffix++; }
  clone.id = nextId;
  clone.title = original.title + ' (Copy)';
  clone.featured = false;
  clone.hidden = true;
  clone.approvalPending = true;
  clone.status = 'Draft';
  clone.statusTone = 'neutral';
  var index = projects.findIndex(function(project) { return project.id === projectId; });
  projects.splice(index + 1, 0, clone);
  saveData(function() {
    closeModal();
    renderProjects();
    openEditor(nextId);
    showToast('Draft copy created. It is hidden until you publish it.');
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

  var absoluteUrl = function(path) { try { return new URL(path, window.location.href).href; } catch (_) { return path; } };
  var setMeta = function(selector, attribute, value) {
    var meta = document.querySelector(selector);
    if (meta) meta.setAttribute(attribute, value);
  };
  var metaDescription = (proj.description || proj.detail.overview || '').slice(0, 158);
  setMeta('meta[name="description"]', 'content', metaDescription);
  setMeta('meta[property="og:title"]', 'content', proj.title + ' | Seif Aldeen');
  setMeta('meta[property="og:description"]', 'content', metaDescription);
  if (proj.images[0]) setMeta('meta[property="og:image"]', 'content', absoluteUrl(proj.images[0].src));
  setMeta('link[rel="canonical"]', 'href', 'https://seif-aldeen.github.io/project.html?id=' + encodeURIComponent(proj.id));
  var oldSchema = document.getElementById('projectSchema');
  if (oldSchema) oldSchema.remove();
  var schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.id = 'projectSchema';
  schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: proj.title, description: metaDescription, creator: { '@type': 'Person', name: 'Seif Aldeen Saeed Ahmed', url: 'https://seif-aldeen.github.io/' }, image: (proj.images || []).filter(function(item) { return (item.type || detectMediaType(item.src)) !== 'video'; }).slice(0, 6).map(function(item) { return absoluteUrl(item.src); }), keywords: (proj.tags || []).join(', '), url: 'https://seif-aldeen.github.io/project.html?id=' + encodeURIComponent(proj.id) });
  document.head.appendChild(schema);

  var headerEl = document.querySelector('.project-header h1');
  var labelEl = document.querySelector('.project-header .card-label');
  var tagsEl = document.querySelector('.project-header .tag-list');
  if (headerEl) headerEl.textContent = proj.title;
  if (labelEl) labelEl.textContent = proj.label;
  if (tagsEl) tagsEl.innerHTML = proj.tags.map(function(t) { return '<li>' + escHtml(t) + '</li>'; }).join('');
  var statusDetail = document.getElementById('projectStatusDetail');
  if (statusDetail) statusDetail.innerHTML = proj.status ? '<span class="project-status status-' + escHtml(proj.statusTone || 'neutral') + '">' + escHtml(proj.status) + '</span>' : '';
  var ratingDetail = document.getElementById('projectRatingDetail');
  if (ratingDetail) {
    ratingDetail.hidden = !proj.rating;
    ratingDetail.innerHTML = proj.rating ? '<strong>\u2605 ' + escHtml(proj.rating) + ' / 5</strong> \u00B7 Upwork client review' : '';
  }

  var mediaContainer = document.querySelector('.media-container');
  function setHeroMedia(index) {
    if (!mediaContainer || !proj.images[index]) return;
    var media = proj.images[index];
    var type = media.type || detectMediaType(media.src);
    mediaContainer.innerHTML = '';
    if (type === 'video') {
      var videoLaunch = document.createElement('button');
      videoLaunch.className = 'video-launch';
      videoLaunch.type = 'button';
      videoLaunch.innerHTML = '<span class="video-launch-icon">\u25B6</span><strong>Play project video</strong><small>Opens the original video only when requested</small>';
      videoLaunch.addEventListener('click', function() { window.open(media.src, '_blank', 'noopener'); });
      mediaContainer.appendChild(videoLaunch);
    } else {
      var heroImg = document.createElement('img');
      heroImg.src = media.src;
      heroImg.alt = media.alt || proj.title;
      heroImg.decoding = 'async';
      heroImg.addEventListener('click', function() { openLightbox(index); });
      mediaContainer.appendChild(heroImg);
    }
    document.querySelectorAll('.gallery-thumb').forEach(function(button, buttonIndex) { button.classList.toggle('is-active', buttonIndex === index); });
  }
  if (proj.images.length) setHeroMedia(0);
  else if (mediaContainer) mediaContainer.innerHTML = '<div class="media-fallback"><p>No media yet.</p></div>';

  var thumbnails = document.getElementById('galleryThumbnails');
  if (thumbnails) {
    thumbnails.innerHTML = '';
    proj.images.forEach(function(media, index) {
      var type = media.type || detectMediaType(media.src);
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumb' + (index === 0 ? ' is-active' : '');
      button.setAttribute('aria-label', (type === 'video' ? 'Play ' : 'Show ') + (media.alt || ('media ' + (index + 1))));
      if (type === 'video') button.innerHTML = '<span class="gallery-thumb-video">\u25B6</span>';
      else button.innerHTML = '<img src="' + escHtml(media.src) + '" alt="" loading="lazy">';
      button.addEventListener('click', function() { setHeroMedia(index); mediaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      thumbnails.appendChild(button);
    });
    thumbnails.hidden = proj.images.length < 2;
  }

  var overviewEl = document.getElementById('detailOverview');
  if (overviewEl) overviewEl.textContent = proj.detail.overview || 'No overview provided yet.';
  var objectiveEl = document.getElementById('detailObjective');
  if (objectiveEl) objectiveEl.textContent = proj.detail.objective || proj.description || 'No objective provided yet.';
  var roleEl = document.getElementById('detailRole');
  if (roleEl) roleEl.textContent = proj.detail.role || 'No details provided yet.';

  renderDetailSection('detailHighlights', 'Technical Highlights', proj.detail.highlights, true);
  renderDetailSection('detailMilestones', 'Milestones & Handoffs', proj.detail.milestones, true);
  renderDetailSection('detailDecisions', 'Engineering Decisions', proj.detail.decisions, true);
  renderDetailSection('detailDeliverables', 'Selected Deliverables & Evidence', proj.detail.deliverables, true);
  renderDetailSection('detailChallenges', 'Challenges & Problem Solving', proj.detail.challenges);
  renderDetailSection('detailResults', 'Results', proj.detail.results);
  var clientFeedback = document.getElementById('detailClientFeedback');
  if (clientFeedback) {
    if (!proj.reviewText && !proj.rating) {
      clientFeedback.style.display = 'none';
    } else {
      clientFeedback.style.display = '';
      var feedbackBody = clientFeedback.querySelector('.detail-body');
      feedbackBody.innerHTML = '<div class="client-review-card"><div class="review-meta"><strong>\u2605 ' + escHtml(proj.rating || 'Client review') + '</strong>' + (proj.reviewTitle ? ' \u00B7 ' + escHtml(proj.reviewTitle) : '') + (proj.reviewDate ? '<br>' + escHtml(proj.reviewDate) : '') + '</div><p>' + escHtml(proj.reviewText || '') + '</p></div>';
    }
  }
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
        var videoCard = document.createElement('div');
        videoCard.className = 'gallery-video-card';
        videoCard.innerHTML = '<span>\u25B6</span><strong>Play video</strong><small>Loaded on demand</small>';
        figure.appendChild(videoCard);
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

  if (gallery) {
    gallery.querySelectorAll('.gallery-figure').forEach(function(fig) {
      fig.style.cursor = 'pointer';
      fig.addEventListener('click', function() {
        var img = fig.querySelector('img');
        var figureIndex = Array.prototype.indexOf.call(gallery.children, fig) + 1;
        var idx = img ? lightboxImages.findIndex(function(x) { return absoluteUrl(x.src) === img.src; }) : figureIndex;
        if (idx >= 0) {
          var itemType = lightboxImages[idx].type || detectMediaType(lightboxImages[idx].src);
          if (itemType === 'video') window.open(lightboxImages[idx].src, '_blank');
          else openLightbox(idx);
        }
      });
    });
  }

  var visibleProjects = projects.filter(function(project) { return !project.hidden; });
  var currentIndex = visibleProjects.findIndex(function(project) { return project.id === proj.id; });
  var prev = currentIndex > 0 ? visibleProjects[currentIndex - 1] : null;
  var next = currentIndex >= 0 && currentIndex < visibleProjects.length - 1 ? visibleProjects[currentIndex + 1] : null;
  var prevLink = document.getElementById('prevProjectLink');
  var nextLink = document.getElementById('nextProjectLink');
  if (prevLink) { prevLink.hidden = !prev; if (prev) { prevLink.href = 'project.html?id=' + encodeURIComponent(prev.id); prevLink.innerHTML = '<small>\u2190 Previous</small><strong>' + escHtml(prev.title) + '</strong>'; } }
  if (nextLink) { nextLink.hidden = !next; if (next) { nextLink.href = 'project.html?id=' + encodeURIComponent(next.id); nextLink.innerHTML = '<small>Next \u2192</small><strong>' + escHtml(next.title) + '</strong>'; } }

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

function initHeroVideo() {
  var video = document.querySelector('.hero-video-bg video');
  var source = video ? video.querySelector('source[data-src]') : null;
  if (!video || !source) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData) return;
  var startVideo = function() {
    if (source.src) return;
    source.src = source.getAttribute('data-src');
    video.load();
    video.play().catch(function() {});
  };
  if ('requestIdleCallback' in window) requestIdleCallback(startVideo, { timeout: 1800 });
  else window.addEventListener('load', function() { setTimeout(startVideo, 700); }, { once: true });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  isDevMode = new URLSearchParams(window.location.search).get('admin') === '1';
  setYear();
  initHeroVideo();
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
