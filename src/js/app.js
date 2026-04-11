AOS.init({
            duration: 650,
            once: true,
            easing: 'ease-out-cubic',
            offset: 48,
            delay: 0
        });

(function () {
    'use strict';

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = String(new Date().getFullYear());
    }

    const THEME_KEY = 'image-resizer-theme';
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        const t = theme === 'light' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', t);
        if (!themeToggle) return;
        const isDark = t === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
        themeToggle.innerHTML = isDark
            ? '<i class="bx bx-sun" aria-hidden="true"></i>'
            : '<i class="bx bx-moon" aria-hidden="true"></i>';
    }

    function initTheme() {
        let stored = null;
        try {
            stored = localStorage.getItem(THEME_KEY);
        } catch (_) {}
        if (stored === 'light' || stored === 'dark') {
            applyTheme(stored);
            return;
        }
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                applyTheme('light');
                return;
            }
        } catch (_) {}
        applyTheme('dark');
    }

    initTheme();
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (_) {}
            applyTheme(next);
        });
    }

    const uploadSection = document.getElementById('upload-section');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewGrid = document.getElementById('file-preview-grid');
    const heroSelectBtn = document.getElementById('hero-select-btn');
    const heroWorkspaceBtn = document.getElementById('hero-workspace-btn');
    const footerSelectBtn = document.getElementById('footer-select-btn');
    const tabPixels = document.getElementById('tab-pixels');
    const tabPercent = document.getElementById('tab-percent');
    const pixelInputs = document.getElementById('pixel-inputs');
    const percentInputs = document.getElementById('percent-inputs');
    const widthPx = document.getElementById('width-px');
    const heightPx = document.getElementById('height-px');
    const dimUnitEl = document.getElementById('dim-unit');
    const widthAddon = document.getElementById('width-addon');
    const heightAddon = document.getElementById('height-addon');
    const scalePercent = document.getElementById('scale-percent');
    const maintainRatio = document.getElementById('maintain-ratio');
    const noEnlarge = document.getElementById('no-enlarge');
    const qualityEl = document.getElementById('quality');
    const qualityLabel = document.getElementById('quality-label');
    const optimizeWeb = document.getElementById('optimize-web');
    const formatCards = document.querySelectorAll('.format-card');
    const bgSwatches = document.querySelectorAll('.bg-swatch');
    const baseName = document.getElementById('base-name');
    const nameDims = document.getElementById('name-dims');
    const nameOriginal = document.getElementById('name-original');
    const namePreview = document.getElementById('name-preview');
    const btnResize = document.getElementById('btn-resize');
    const btnResizeText = document.getElementById('btn-resize-text');
    const sumMethod = document.getElementById('sum-method');
    const sumDims = document.getElementById('sum-dims');
    const sumFormat = document.getElementById('sum-format');
    const sumBg = document.getElementById('sum-bg');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedPanel = document.getElementById('advanced-panel');
    const advancedChevron = document.getElementById('advanced-chevron');
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    const resultsSection = document.getElementById('results-section');
    const resultsTbody = document.getElementById('results-tbody');
    const btnDownloadAll = document.getElementById('btn-download-all');

    /** CSS / screen reference: pixels per inch for converting in and cm to output pixels */
    const CSS_PPI = 96;

    let mode = 'pixels';
    /** @type {'px'|'in'|'cm'} */
    let dimensionUnit = dimUnitEl && dimUnitEl.value ? dimUnitEl.value : 'px';
    let selectedMime = 'image/jpeg';
    let bgMode = 'transparent';
    /** @type {{ id: number, file: File, img: HTMLImageElement, url: string, cardEl: HTMLElement }[]} */
    let items = [];
    let nextFileId = 0;
    /** @type {{ name: string, blob: Blob }[]} */
    let processedOutputs = [];

    function toPixels(val, unit) {
        const n = parseFloat(String(val));
        if (!(n > 0) || !isFinite(n)) return NaN;
        if (unit === 'px') return Math.max(1, Math.round(n));
        if (unit === 'in') return Math.max(1, Math.round(n * CSS_PPI));
        if (unit === 'cm') return Math.max(1, Math.round((n * CSS_PPI) / 2.54));
        return Math.max(1, Math.round(n));
    }

    function fromPixels(px, unit) {
        const p = Math.max(1, px);
        if (unit === 'px') return p;
        if (unit === 'in') return p / CSS_PPI;
        if (unit === 'cm') return (p * 2.54) / CSS_PPI;
        return p;
    }

    function formatDimValue(num, unit) {
        if (!isFinite(num) || num <= 0) return '';
        if (unit === 'px') return String(Math.max(1, Math.round(num)));
        const v = Math.round(num * 10000) / 10000;
        let s = String(v);
        if (s.includes('.')) s = s.replace(/\.?0+$/, '');
        return s;
    }

    function readTargetBoxPixels() {
        const wPx = toPixels(widthPx.value, dimensionUnit);
        const hPx = toPixels(heightPx.value, dimensionUnit);
        return {
            targetW: isFinite(wPx) && wPx > 0 ? wPx : 1,
            targetH: isFinite(hPx) && hPx > 0 ? hPx : 1
        };
    }

    function syncDimensionUnitUI() {
        const isPx = dimensionUnit === 'px';
        const suffix = dimensionUnit === 'px' ? 'px' : dimensionUnit === 'in' ? 'in' : 'cm';
        widthPx.min = isPx ? '1' : '0.01';
        heightPx.min = isPx ? '1' : '0.01';
        widthPx.step = isPx ? '1' : '0.01';
        heightPx.step = isPx ? '1' : '0.01';
        if (widthAddon) widthAddon.textContent = suffix;
        if (heightAddon) heightAddon.textContent = suffix;
    }

    function applyPixelPreset(w, h) {
        // Keep the preset as a "pixel bounds" box (output may be smaller when "Maintain aspect ratio" is enabled).
        mode = 'pixels';
        tabPixels.classList.add('active');
        tabPercent.classList.remove('active');
        tabPixels.setAttribute('aria-selected', 'true');
        tabPercent.setAttribute('aria-selected', 'false');
        pixelInputs.classList.remove('d-none');
        percentInputs.classList.add('d-none');

        dimensionUnit = 'px';
        if (dimUnitEl) dimUnitEl.value = 'px';
        syncDimensionUnitUI();

        widthPx.value = String(w);
        heightPx.value = String(h);
        updateSummary();
        previewFilename();
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    function buildFileCard(id, file, thumbUrl) {
        const card = document.createElement('div');
        card.className = 'file-preview-card';
        card.dataset.fileId = String(id);

        const wrap = document.createElement('div');
        wrap.className = 'file-preview-thumb-wrap';
        const imgEl = document.createElement('img');
        imgEl.src = thumbUrl;
        imgEl.alt = '';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'file-preview-remove';
        btn.setAttribute('aria-label', 'Remove ' + file.name);
        btn.innerHTML = '<i class="bx bx-x"></i>';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFileById(id);
        });

        wrap.appendChild(imgEl);
        wrap.appendChild(btn);

        const meta = document.createElement('div');
        meta.className = 'file-preview-meta';
        const nm = document.createElement('div');
        nm.className = 'file-preview-name';
        nm.textContent = file.name;
        nm.title = file.name;
        const sz = document.createElement('div');
        sz.className = 'file-preview-size';
        sz.textContent = formatFileSize(file.size);
        meta.appendChild(nm);
        meta.appendChild(sz);

        card.appendChild(wrap);
        card.appendChild(meta);
        return card;
    }

    function removeFileById(id) {
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) return;
        const entry = items[idx];
        URL.revokeObjectURL(entry.url);
        entry.cardEl.remove();
        items.splice(idx, 1);

        if (items.length === 0) {
            previewGrid.hidden = true;
        } else if (maintainRatio.checked && mode === 'pixels') {
            const nw = items[0].img.naturalWidth;
            const nh = items[0].img.naturalHeight;
            widthPx.value = formatDimValue(fromPixels(nw, dimensionUnit), dimensionUnit);
            heightPx.value = formatDimValue(fromPixels(nh, dimensionUnit), dimensionUnit);
        }
        updateBtn();
        updateSummary();
        previewFilename();
    }

    const toastEl = document.getElementById('toast-el');
    const toastBody = document.getElementById('toast-body');
    const toastClose = document.getElementById('toast-close');
    let toastTimer;

    function hideToast() {
        toastEl.classList.remove('is-visible');
    }

    function showToast(msg, tone = 'error') {
        toastBody.textContent = msg;
        toastEl.classList.remove('is-success', 'is-info');
        if (tone === 'success') toastEl.classList.add('is-success');
        else if (tone === 'info') toastEl.classList.add('is-info');
        toastEl.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, 4500);
    }

    toastClose.addEventListener('click', () => {
        clearTimeout(toastTimer);
        hideToast();
    });

    if (location.protocol === 'file:') {
        const banner = document.getElementById('file-protocol-banner');
        const snippet = document.getElementById('serve-snippet');
        banner.classList.add('is-visible');
        try {
            const p = decodeURIComponent(location.pathname);
            if (/^\/[A-Za-z]:\//.test(p)) {
                const winPath = p.slice(1).replace(/\//g, '\\');
                const dir = winPath.replace(/\\[^\\]+$/, '');
                snippet.textContent = 'cd /d "' + dir + '" && python -m http.server 8765';
            } else {
                const dir = p.replace(/\/[^/]+$/, '') || '/';
                snippet.textContent = 'cd "' + dir + '" && python3 -m http.server 8765';
            }
        } catch (e) { /* keep default */ }
    }

    function getSelectedFormatLabel() {
        if (selectedMime === 'image/png') return 'PNG';
        if (selectedMime === 'image/webp') return 'WebP';
        return 'JPEG';
    }

    function syncAdvancedQualityFill() {
        if (!qualityEl) return;
        const min = parseFloat(qualityEl.min) || 0;
        const max = parseFloat(qualityEl.max) || 100;
        const val = parseFloat(qualityEl.value) || 0;
        const pct = max <= min ? 0 : ((val - min) / (max - min)) * 100;
        qualityEl.style.setProperty('--range-fill', pct + '%');
    }

    function updateQualityDisabled() {
        const lossless = selectedMime === 'image/png';
        qualityEl.disabled = lossless;
        const row = qualityEl.closest('.advanced-quality-row');
        if (row) row.style.opacity = lossless ? '0.45' : '1';
        if (lossless) qualityLabel.textContent = 'N/A';
        else qualityLabel.textContent = qualityEl.value + '%';
        syncAdvancedQualityFill();
    }

    function updateSummary() {
        sumMethod.textContent = mode === 'pixels' ? 'Pixels' : 'Percentage';
        if (mode === 'pixels') {
            const wVal = parseFloat(widthPx.value);
            const hVal = parseFloat(heightPx.value);
            const uSuf = dimensionUnit === 'px' ? 'px' : dimensionUnit === 'in' ? 'in' : 'cm';
            const wDisp = isFinite(wVal) && wVal > 0 ? formatDimValue(wVal, dimensionUnit) : '—';
            const hDisp = isFinite(hVal) && hVal > 0 ? formatDimValue(hVal, dimensionUnit) : '—';
            const hasImg = items.length > 0 && maintainRatio.checked;
            if (hasImg) {
                const nw = items[0].img.naturalWidth;
                const nh = items[0].img.naturalHeight;
                const { tw, th } = computeTargetSize(nw, nh);
                sumDims.textContent = `${tw} — ${th} px`;
            } else {
                sumDims.textContent = `${wDisp} × ${hDisp} ${uSuf}`;
            }
        } else {
            sumDims.textContent = `${scalePercent.value || '—'}% of each image`;
        }
        sumFormat.textContent = getSelectedFormatLabel();
        if (bgMode === 'transparent') {
            sumBg.textContent = selectedMime === 'image/jpeg'
                ? 'Transparent → white fill for JPEG'
                : 'Transparent (PNG/WebP)';
        } else {
            sumBg.textContent = bgMode === 'white' ? 'White' : 'Black';
        }
    }

    function previewFilename() {
        const ext = selectedMime === 'image/png' ? 'png' : selectedMime === 'image/webp' ? 'webp' : 'jpg';
        const base = baseName.value.trim().replace(/[/\\?%*:|"<>]/g, '-');
        const kebab = (s) => s
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        let dimPart = 'WxH';
        if (mode === 'pixels') {
            const { targetW, targetH } = readTargetBoxPixels();
            if (targetW > 0 && targetH > 0) dimPart = `${targetW}x${targetH}`;
        } else {
            dimPart = `${parseInt(scalePercent.value, 10) || 100}pct`;
        }
        let parts = [];
        if (base) parts.push(kebab(base));
        if (nameOriginal.checked) parts.push('original-name');
        if (nameDims.checked) parts.push(dimPart);
        const stem = parts.length ? parts.join('-') : 'image';
        namePreview.textContent = `${stem}.${ext}`;
    }

    function updateBtn() {
        const n = items.length;
        btnResize.disabled = n === 0;
        btnResizeText.textContent = n === 1 ? 'Resize 1 Image' : `Resize ${n} Images`;
    }

    function updateDownloadAllBtn() {
        if (!btnDownloadAll) return;
        btnDownloadAll.disabled = processedOutputs.length === 0;
    }

    document.querySelectorAll('.rt-preset-link').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const w = parseInt(el.getAttribute('data-preset-w') || '', 10);
            const h = parseInt(el.getAttribute('data-preset-h') || '', 10);
            if (!w || !h) return;
            applyPixelPreset(w, h);
            const workspace = document.querySelector('.resizer-card');
            if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    function syncRatioFromWidth() {
        if (!maintainRatio.checked || mode !== 'pixels' || !items.length) return;
        const w = parseFloat(widthPx.value);
        if (!(w > 0)) return;
        const wPx = toPixels(w, dimensionUnit);
        if (!(wPx > 0)) return;
        const nw = items[0].img.naturalWidth;
        const nh = items[0].img.naturalHeight;
        if (!(nw > 0 && nh > 0)) return;
        const th = Math.max(1, Math.round((wPx * nh) / nw));
        heightPx.value = formatDimValue(fromPixels(th, dimensionUnit), dimensionUnit);
    }

    function syncRatioFromHeight() {
        if (!maintainRatio.checked || mode !== 'pixels' || !items.length) return;
        const h = parseFloat(heightPx.value);
        if (!(h > 0)) return;
        const hPx = toPixels(h, dimensionUnit);
        if (!(hPx > 0)) return;
        const nw = items[0].img.naturalWidth;
        const nh = items[0].img.naturalHeight;
        if (!(nw > 0 && nh > 0)) return;
        const tw = Math.max(1, Math.round((hPx * nw) / nh));
        widthPx.value = formatDimValue(fromPixels(tw, dimensionUnit), dimensionUnit);
    }

    function onWidthPxAdjust() {
        syncRatioFromWidth();
        updateSummary();
        previewFilename();
    }

    function onHeightPxAdjust() {
        syncRatioFromHeight();
        updateSummary();
        previewFilename();
    }

    widthPx.addEventListener('input', onWidthPxAdjust);
    widthPx.addEventListener('change', onWidthPxAdjust);
    heightPx.addEventListener('input', onHeightPxAdjust);
    heightPx.addEventListener('change', onHeightPxAdjust);
    scalePercent.addEventListener('input', () => { updateSummary(); previewFilename(); });
    maintainRatio.addEventListener('change', () => {
        if (maintainRatio.checked && items.length && mode === 'pixels') syncRatioFromWidth();
        updateSummary();
    });
    noEnlarge.addEventListener('change', updateSummary);
    baseName.addEventListener('input', previewFilename);
    nameDims.addEventListener('change', previewFilename);
    nameOriginal.addEventListener('change', previewFilename);

    qualityEl.addEventListener('input', () => {
        if (!qualityEl.disabled) qualityLabel.textContent = qualityEl.value + '%';
        syncAdvancedQualityFill();
    });

    optimizeWeb.addEventListener('change', () => {
        if (optimizeWeb.checked && selectedMime !== 'image/png') {
            qualityEl.value = String(Math.min(parseInt(qualityEl.value, 10), 82));
            qualityLabel.textContent = qualityEl.value + '%';
            syncAdvancedQualityFill();
        }
    });

    tabPixels.addEventListener('click', () => {
        mode = 'pixels';
        tabPixels.classList.add('active');
        tabPercent.classList.remove('active');
        tabPixels.setAttribute('aria-selected', 'true');
        tabPercent.setAttribute('aria-selected', 'false');
        pixelInputs.classList.remove('d-none');
        percentInputs.classList.add('d-none');
        updateSummary();
        previewFilename();
    });

    tabPercent.addEventListener('click', () => {
        mode = 'percent';
        tabPercent.classList.add('active');
        tabPixels.classList.remove('active');
        tabPercent.setAttribute('aria-selected', 'true');
        tabPixels.setAttribute('aria-selected', 'false');
        pixelInputs.classList.add('d-none');
        percentInputs.classList.remove('d-none');
        updateSummary();
        previewFilename();
    });

    if (dimUnitEl) {
        dimUnitEl.addEventListener('change', () => {
            const prev = dimensionUnit;
            dimensionUnit = /** @type {'px'|'in'|'cm'} */ (dimUnitEl.value || 'px');
            const wPx = toPixels(widthPx.value, prev);
            const hPx = toPixels(heightPx.value, prev);
            if (isFinite(wPx) && wPx > 0) {
                widthPx.value = formatDimValue(fromPixels(wPx, dimensionUnit), dimensionUnit);
            }
            if (isFinite(hPx) && hPx > 0) {
                heightPx.value = formatDimValue(fromPixels(hPx, dimensionUnit), dimensionUnit);
            }
            syncDimensionUnitUI();
            if (maintainRatio.checked && items.length && mode === 'pixels') syncRatioFromWidth();
            updateSummary();
            previewFilename();
        });
    }

    formatCards.forEach(card => {
        card.addEventListener('click', () => {
            formatCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMime = card.getAttribute('data-mime');
            updateQualityDisabled();
            updateSummary();
            previewFilename();
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    bgSwatches.forEach(sw => {
        sw.addEventListener('click', () => {
            bgSwatches.forEach(s => s.classList.remove('active'));
            sw.classList.add('active');
            bgMode = sw.getAttribute('data-bg');
            updateSummary();
        });
    });

    advancedToggle.addEventListener('click', () => {
        const open = !advancedPanel.classList.contains('is-open');
        advancedPanel.classList.toggle('is-open', open);
        advancedPanel.hidden = !open;
        advancedToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            advancedChevron.classList.remove('bx-chevron-down');
            advancedChevron.classList.add('bx-chevron-up');
        } else {
            advancedChevron.classList.remove('bx-chevron-up');
            advancedChevron.classList.add('bx-chevron-down');
        }
    });

    function openFilePicker() {
        fileInput.click();
    }

    if (heroSelectBtn) {
        heroSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openFilePicker();
        });
    }

    if (heroWorkspaceBtn) {
        heroWorkspaceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            (uploadSection || document.body).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (footerSelectBtn) {
        footerSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openFilePicker();
        });
    }

    dropZone.addEventListener('click', (e) => {
        if (e.target === fileInput) return;
        openFilePicker();
    });

    dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
        }
    });

    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    uploadSection.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    uploadSection.addEventListener('dragleave', (e) => {
        if (!uploadSection.contains(e.relatedTarget)) {
            dropZone.classList.remove('dragover');
        }
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length) {
            revokeAll();
            addFiles(files);
        }
        else if (e.dataTransfer.files.length) showToast('Please drop image files only.');
    });

    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files || []);
        if (files.length) {
            revokeAll();
            addFiles(files);
        }
        fileInput.value = '';
    });

    function revokeAll() {
        items.forEach(({ url }) => URL.revokeObjectURL(url));
        items = [];
        nextFileId = 0;
        processedOutputs = [];
        previewGrid.innerHTML = '';
        previewGrid.hidden = true;
        if (resultsTbody) resultsTbody.innerHTML = '';
        if (resultsSection) resultsSection.hidden = true;
        updateDownloadAllBtn();
        updateBtn();
        updateSummary();
        previewFilename();
    }

    function addFiles(files) {
        const toLoad = files.filter(f => f.type.startsWith('image/'));
        if (!toLoad.length) {
            showToast('No valid image files selected.');
            return;
        }
        let pending = toLoad.length;
        toLoad.forEach(file => {
            const id = ++nextFileId;
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                const card = buildFileCard(id, file, url);
                items.push({ id, file, img, url, cardEl: card });
                previewGrid.appendChild(card);
                previewGrid.hidden = false;
                pending--;
                if (pending === 0) {
                    if (maintainRatio.checked && mode === 'pixels') {
                        const nw = items[0].img.naturalWidth;
                        const nh = items[0].img.naturalHeight;
                        widthPx.value = formatDimValue(fromPixels(nw, dimensionUnit), dimensionUnit);
                        heightPx.value = formatDimValue(fromPixels(nh, dimensionUnit), dimensionUnit);
                    }
                    updateBtn();
                    updateSummary();
                    previewFilename();
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                pending--;
                showToast('Could not read: ' + file.name);
                if (pending === 0) updateBtn();
            };
            img.src = url;
        });
    }

    /**
     * Integer output size that preserves nw:nh, fits inside maxW×maxH, and never exceeds the float “fit” scale
     * (avoids independent rounding errors e.g. 1920×1080 targets or slight aspect drift / 1px box overflow).
     */
    function integerDimensionsAspectInside(nw, nh, maxW, maxH) {
        const nwi = Math.max(1, nw);
        const nhi = Math.max(1, nh);
        const mw = Math.max(1, maxW);
        const mh = Math.max(1, maxH);
        const scale = Math.min(mw / nwi, mh / nhi);
        let tw = Math.max(1, Math.round(nwi * scale));
        let th = Math.max(1, Math.round((tw * nhi) / nwi));
        if (th > mh) {
            th = mh;
            tw = Math.max(1, Math.round((th * nwi) / nhi));
        }
        if (tw > mw) {
            tw = mw;
            th = Math.max(1, Math.round((tw * nhi) / nwi));
        }
        if (th > mh) {
            th = mh;
            tw = Math.max(1, Math.round((th * nwi) / nhi));
        }
        return { tw, th };
    }

    function computeTargetSize(nw, nh) {
        let tw, th;
        if (mode === 'percent') {
            const p = Math.max(1, Math.min(500, parseInt(scalePercent.value, 10) || 100)) / 100;
            const effP = noEnlarge.checked ? Math.min(p, 1) : p;
            tw = Math.max(1, Math.round(nw * effP));
            th = Math.max(1, Math.round((tw * nh) / Math.max(1, nw)));
            if (noEnlarge.checked) {
                if (tw > nw) {
                    tw = nw;
                    th = Math.max(1, Math.round((tw * nh) / Math.max(1, nw)));
                }
                if (th > nh) {
                    th = nh;
                    tw = Math.max(1, Math.round((th * nw) / Math.max(1, nh)));
                }
            }
        } else {
            const { targetW, targetH } = readTargetBoxPixels();
            if (maintainRatio.checked) {
                let maxW = targetW;
                let maxH = targetH;
                if (noEnlarge.checked) {
                    maxW = Math.min(maxW, nw);
                    maxH = Math.min(maxH, nh);
                }
                ({ tw, th } = integerDimensionsAspectInside(nw, nh, maxW, maxH));
            } else {
                tw = targetW;
                th = targetH;
                if (noEnlarge.checked) {
                    tw = Math.min(tw, nw);
                    th = Math.min(th, nh);
                }
            }
        }
        return { tw, th };
    }

    function fillBackground(w, h) {
        if (selectedMime === 'image/png' || selectedMime === 'image/webp') {
            if (bgMode === 'transparent') {
                ctx.clearRect(0, 0, w, h);
                return;
            }
        }
        let fill = '#ffffff';
        if (bgMode === 'black') fill = '#000000';
        else if (bgMode === 'white' || bgMode === 'transparent') fill = '#ffffff';
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, w, h);
    }

    function buildOutputName(originalName, tw, th) {
        const ext = selectedMime === 'image/png' ? 'png' : selectedMime === 'image/webp' ? 'webp' : 'jpg';
        const base = baseName.value.trim().replace(/[/\\?%*:|"<>]/g, '-');
        const stem = originalName.replace(/\.[^/.]+$/, '');
        const kebab = (s) => s
            .trim()
            .toLowerCase()
            .replace(/[/\\?%*:|"<>]/g, '-')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        let parts = [];
        if (base) parts.push(kebab(base));
        if (nameOriginal.checked) parts.push(kebab(stem));
        if (nameDims.checked) parts.push(`${tw}x${th}`);
        let name = parts.filter(Boolean).join('-') || 'resized';
        if (!nameOriginal.checked && !base && !nameDims.checked) name = 'resized';
        return `${name}.${ext}`;
    }

    function canvasToBlobPromise(mime) {
        const q = mime === 'image/png' ? undefined : (parseInt(qualityEl.value, 10) || 90) / 100;
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Export failed (format not supported).'));
                },
                mime,
                q
            );
        });
    }

    function appendResultRow(tbody, serialNo, fileName, fileBytes, nw, nh, tw, th, formatText) {
        const tr = document.createElement('tr');

        const tdSerial = document.createElement('td');
        tdSerial.className = 'text-center dim-muted small';
        tdSerial.textContent = String(serialNo);

        const tdName = document.createElement('td');
        tdName.className = 'col-name';
        tdName.title = fileName;
        tdName.textContent = fileName;

        const tdOrig = document.createElement('td');
        tdOrig.className = 'text-center dim-muted small';
        tdOrig.textContent = nw + 'px' + ' — ' + nh + 'px';

        const tdNew = document.createElement('td');
        tdNew.className = 'text-center';
        const spanNew = document.createElement('span');
        spanNew.className = 'dim-new';
        spanNew.textContent = tw + 'px' + ' — ' + th + 'px';
        tdNew.appendChild(spanNew);

        const tdFmt = document.createElement('td');
        tdFmt.className = 'text-center';
        const spanFmt = document.createElement('span');
        spanFmt.className = 'format-label';
        spanFmt.textContent = formatText;
        tdFmt.appendChild(spanFmt);

        const tdFileSize = document.createElement('td');
        tdFileSize.className = 'text-center dim-muted small';
        tdFileSize.style.whiteSpace = 'nowrap';
        tdFileSize.textContent = formatFileSize(fileBytes);

        const tdStatus = document.createElement('td');
        tdStatus.className = 'text-end';
        const spanAct = document.createElement('span');
        spanAct.className = 'row-status status-processing';
        spanAct.textContent = 'PROCESSING';
        tdStatus.appendChild(spanAct);

        const tdDl = document.createElement('td');
        tdDl.className = 'text-center';
        const downloadBtn = document.createElement('button');
        downloadBtn.type = 'button';
        downloadBtn.className = 'btn-row-download';
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="bx bx-download me-1"></i>Download';
        downloadBtn.addEventListener('click', () => {
            const blob = downloadBtn._resultBlob;
            const name = downloadBtn._downloadName;
            if (!blob || !name) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2500);
            showToast('Started download for "' + name + '".', 'success');
        });
        tdDl.appendChild(downloadBtn);

        tr.appendChild(tdSerial);
        tr.appendChild(tdName);
        tr.appendChild(tdOrig);
        tr.appendChild(tdNew);
        tr.appendChild(tdFmt);
        tr.appendChild(tdFileSize);
        tr.appendChild(tdStatus);
        tr.appendChild(tdDl);
        tbody.appendChild(tr);

        return { formatEl: spanFmt, statusEl: spanAct, downloadBtn, tdFileSize };
    }

    async function processAndResize() {
        if (!items.length) return;
        if (!ctx) {
            showToast('Canvas is not available in this browser.');
            return;
        }

        processedOutputs = [];
        updateDownloadAllBtn();
        resultsTbody.innerHTML = '';
        resultsSection.hidden = false;
        if (typeof AOS !== 'undefined') AOS.refresh();
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        const prevText = btnResizeText.textContent;
        btnResize.disabled = true;
        btnResizeText.textContent = 'Processingâ€¦';

        const useMime = selectedMime;
        let fallbackJpeg = false;
        let anyFailed = false;

        try {
            for (let i = 0; i < items.length; i++) {
                const { file, img } = items[i];
                const nw = img.naturalWidth;
                const nh = img.naturalHeight;
                const { tw, th } = computeTargetSize(nw, nh);

                const { formatEl, statusEl, downloadBtn, tdFileSize } = appendResultRow(
                    resultsTbody,
                    i + 1,
                    file.name,
                    file.size,
                    nw,
                    nh,
                    tw,
                    th,
                    getSelectedFormatLabel()
                );
                void resultsTbody.offsetHeight;

                try {
                    canvas.width = tw;
                    canvas.height = th;
                    fillBackground(tw, th);
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, tw, th);

                    let mime = useMime;
                    let blob;
                    try {
                        blob = await canvasToBlobPromise(mime);
                    } catch (err) {
                        if (mime !== 'image/jpeg') {
                            mime = 'image/jpeg';
                            fallbackJpeg = true;
                            blob = await canvasToBlobPromise('image/jpeg');
                        } else {
                            throw err;
                        }
                    }

                    const stem = buildOutputName(file.name, tw, th).replace(/\.[^.]+$/, '');
                    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
                    const downloadName = `${stem}.${ext}`;

                    formatEl.textContent = ext === 'jpg' ? 'JPEG' : ext.toUpperCase();
                    statusEl.textContent = 'Ready';
                    statusEl.className = 'row-status status-done';
                    downloadBtn.disabled = false;
                    downloadBtn._resultBlob = blob;
                    downloadBtn._downloadName = downloadName;
                    tdFileSize.textContent = `${formatFileSize(file.size)} \u2192 ${formatFileSize(blob.size)}`;
                    processedOutputs.push({ name: downloadName, blob });
                    updateDownloadAllBtn();
                } catch (fileErr) {
                    anyFailed = true;
                    statusEl.textContent = 'Failed';
                    statusEl.className = 'row-status status-error';
                    downloadBtn.disabled = true;
                    downloadBtn.innerHTML = '<span class="text-muted small">â€”</span>';
                }
            }

            if (fallbackJpeg) {
                showToast('WebP not supported â€” use Download for JPEG output.');
            }
            if (anyFailed) {
                showToast('Some images could not be processed.');
            }
        } catch (err) {
            showToast(err.message || 'Resize failed.');
        } finally {
            btnResize.disabled = false;
            btnResizeText.textContent = prevText;
            updateBtn();
        }
    }

    btnResize.addEventListener('click', () => {
        showToast('Processing images… please wait.', 'info');
        processAndResize()
            .then(() => {
                if (processedOutputs.length) {
                    showToast('Resize complete. Use Download buttons or ZIP Download.', 'success');
                }
            })
            .catch((e) => showToast(e.message || 'Resize failed.'));
    });

    if (btnDownloadAll) {
        btnDownloadAll.addEventListener('click', async () => {
            if (!processedOutputs.length) return;
            if (typeof JSZip === 'undefined') {
                showToast('ZIP library not loaded.');
                return;
            }

            const zip = new JSZip();
            processedOutputs.forEach(({ name, blob }) => {
                zip.file(name, blob);
            });

            try {
                showToast('Preparing ZIP download…', 'info');
                btnDownloadAll.disabled = true;
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resized-images.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 2500);
                showToast('ZIP download started.', 'success');
            } catch (err) {
                showToast('Could not create ZIP file.');
            } finally {
                updateDownloadAllBtn();
            }
        });
    }

    syncDimensionUnitUI();
    updateQualityDisabled();
    syncAdvancedQualityFill();
    updateSummary();
    previewFilename();
    updateBtn();
    updateDownloadAllBtn();
})();

