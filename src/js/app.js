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

    let mode = 'pixels';
    let selectedMime = 'image/jpeg';
    let bgMode = 'transparent';
    /** @type {{ id: number, file: File, img: HTMLImageElement, url: string, cardEl: HTMLElement }[]} */
    let items = [];
    let nextFileId = 0;
    /** @type {{ name: string, blob: Blob }[]} */
    let processedOutputs = [];

    function applyPixelPreset(w, h) {
        // Keep the preset as a "pixel bounds" box (output may be smaller when "Maintain aspect ratio" is enabled).
        mode = 'pixels';
        tabPixels.classList.add('active');
        tabPercent.classList.remove('active');
        tabPixels.setAttribute('aria-selected', 'true');
        tabPercent.setAttribute('aria-selected', 'false');
        pixelInputs.classList.remove('d-none');
        percentInputs.classList.add('d-none');

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
            widthPx.value = String(items[0].img.naturalWidth);
            heightPx.value = String(items[0].img.naturalHeight);
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

    function showToast(msg) {
        toastBody.textContent = msg;
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
            const wVal = parseInt(widthPx.value, 10);
            const hVal = parseInt(heightPx.value, 10);
            const hasImg = items.length > 0 && maintainRatio.checked;
            if (hasImg) {
                const nw = items[0].img.naturalWidth;
                const nh = items[0].img.naturalHeight;
                const { tw, th } = computeTargetSize(nw, nh);
                sumDims.textContent = `${tw} — ${th} px`;
            } else {
                sumDims.textContent = `${(wVal > 0 ? wVal : '—')} × ${(hVal > 0 ? hVal : '—')} px`;
            }
        } else {
            sumDims.textContent = `${scalePercent.value || '—'}% of each image`;
        }
        sumFormat.textContent = getSelectedFormatLabel();
        if (bgMode === 'transparent') {
            sumBg.textContent = selectedMime === 'image/jpeg'
                ? 'Transparent â†’ white fill for JPEG'
                : 'Transparent (PNG/WebP)';
        } else {
            sumBg.textContent = bgMode === 'white' ? 'White' : 'Black';
        }
    }

    function previewFilename() {
        const ext = selectedMime === 'image/png' ? 'png' : selectedMime === 'image/webp' ? 'webp' : 'jpg';
        const base = baseName.value.trim().replace(/[/\\?%*:|"<>]/g, '-');
        let dimPart = 'WxH';
        if (mode === 'pixels') {
            const w = parseInt(widthPx.value, 10);
            const h = parseInt(heightPx.value, 10);
            if (w > 0 && h > 0) dimPart = `${w}x${h}`;
        } else {
            dimPart = `${parseInt(scalePercent.value, 10) || 100}pct`;
        }
        let parts = [];
        if (base) parts.push(base);
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

    // Footer "Tools" pixel presets
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
        if (!maintainRatio.checked || mode !== 'pixels') return;
        const w = parseInt(widthPx.value, 10);
        const h = parseInt(heightPx.value, 10);
        if (w > 0 && h > 0 && items.length) {
            const r = items[0].img.naturalHeight / items[0].img.naturalWidth;
            heightPx.value = Math.max(1, Math.round(w * r));
        }
    }

    function syncRatioFromHeight() {
        if (!maintainRatio.checked || mode !== 'pixels') return;
        const w = parseInt(widthPx.value, 10);
        const h = parseInt(heightPx.value, 10);
        if (w > 0 && h > 0 && items.length) {
            const r = items[0].img.naturalWidth / items[0].img.naturalHeight;
            widthPx.value = Math.max(1, Math.round(h * r));
        }
    }

    widthPx.addEventListener('input', () => { syncRatioFromWidth(); updateSummary(); previewFilename(); });
    heightPx.addEventListener('input', () => { syncRatioFromHeight(); updateSummary(); previewFilename(); });
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
                        widthPx.value = String(items[0].img.naturalWidth);
                        heightPx.value = String(items[0].img.naturalHeight);
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

    function computeTargetSize(nw, nh) {
        let tw, th;
        if (mode === 'percent') {
            const p = Math.max(1, Math.min(500, parseInt(scalePercent.value, 10) || 100)) / 100;
            tw = Math.max(1, Math.round(nw * p));
            th = Math.max(1, Math.round(nh * p));
        } else {
            const targetW = Math.max(1, parseInt(widthPx.value, 10) || 1);
            const targetH = Math.max(1, parseInt(heightPx.value, 10) || 1);
            if (maintainRatio.checked) {
                const scale = Math.min(targetW / nw, targetH / nh);
                tw = Math.max(1, Math.round(nw * scale));
                th = Math.max(1, Math.round(nh * scale));
            } else {
                tw = targetW;
                th = targetH;
            }
        }
        if (noEnlarge.checked) {
            tw = Math.min(tw, nw);
            th = Math.min(th, nh);
            if (maintainRatio.checked) {
                const scale = Math.min(tw / nw, th / nh);
                tw = Math.max(1, Math.round(nw * scale));
                th = Math.max(1, Math.round(nh * scale));
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
        let parts = [];
        if (base) parts.push(base);
        if (nameOriginal.checked) parts.push(stem);
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

    function appendResultRow(tbody, fileName, nw, nh, tw, th, formatText) {
        const tr = document.createElement('tr');

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
        });
        tdDl.appendChild(downloadBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdOrig);
        tr.appendChild(tdNew);
        tr.appendChild(tdFmt);
        tr.appendChild(tdStatus);
        tr.appendChild(tdDl);
        tbody.appendChild(tr);

        return { formatEl: spanFmt, statusEl: spanAct, downloadBtn };
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

                const { formatEl, statusEl, downloadBtn } = appendResultRow(
                    resultsTbody,
                    file.name,
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
        processAndResize().catch((e) => showToast(e.message || 'Resize failed.'));
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
            } catch (err) {
                showToast('Could not create ZIP file.');
            } finally {
                updateDownloadAllBtn();
            }
        });
    }

    updateQualityDisabled();
    syncAdvancedQualityFill();
    updateSummary();
    previewFilename();
    updateBtn();
    updateDownloadAllBtn();
})();

