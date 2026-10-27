@extends('layouts.app')

@section('content')
    <main class="container py-4 py-lg-5">
        <div class="image-resizer-hero mb-4 mb-lg-5" data-aos="fade-up" data-aos-duration="650">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-3">
                    <li class="breadcrumb-item"><a href="{{ route('home') }}">Home</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Resize Image</li>
                </ol>
            </nav>
            <div class="row align-items-center g-4">
                <div class="col-lg-7">
                    <div class="image-resizer-hero-badge">
                        <i class="bx bx-grid-alt"></i>
                        Pixel-perfect SaaS feel
                    </div>

                    <h1 class="display-5 fw-bold mb-3">
                        Resize images in pixels <span class="text-gradient">fast, private & precise</span>
                    </h1>

                    <p class="mb-2" style="color: var(--image-resizer-text-muted); font-size: 1.05rem; line-height: 1.65;">
                        Set exact <strong>Width x Height (px)</strong>, optionally lock aspect ratio, pick JPG / PNG / WebP, then export the batch. Everything runs client-side.
                    </p>

                    <div class="hero-feature-chips" aria-label="Key features">
                        <span class="hero-feature-chip"><i class="bx bx-shield-check"></i>100% on-device</span>
                        <span class="hero-feature-chip"><i class="bx bx-ruler"></i>Exact pixel bounds</span>
                        <span class="hero-feature-chip"><i class="bx bx-code-alt"></i>Instant JPG/PNG/WebP</span>
                    </div>

                    <div class="hero-cta d-flex gap-3 flex-wrap">
                        <button type="button" id="hero-select-btn" class="btn hero-btn-primary">
                            <i class="bx bx-cloud-upload me-2"></i>Select images
                        </button>
                        <a href="#upload-section" id="hero-workspace-btn" class="btn hero-btn-outline">
                            <i class="bx bx-slider me-2"></i>Set dimensions
                        </a>
                    </div>

                    <p class="small mb-0 mt-3">
                        <a href="#" class="text-decoration-none fw-semibold" style="color: var(--image-resizer-accent);">
                            <i class="bx bx-edit-alt me-1"></i>Need cropping, filters, or layers? Use a desktop editor.
                        </a>
                    </p>
                </div>

                <div class="col-lg-5">
                    <div class="hero-mock" aria-hidden="true">
                        <div class="hero-mock-inner">
                            <div class="hero-mock-row">
                                <div class="hero-mock-card">
                                    <div class="hero-mock-card-head">
                                        <span class="hero-mock-pill">Before</span>
                                        <span class="hero-mock-dims">1920 × 1080 px</span>
                                    </div>
                                    <div class="hero-mock-preview"></div>
                                </div>
                                <div class="hero-mock-arrow">
                                    <i class="bx bx-right-arrow-alt"></i>
                                </div>
                                <div class="hero-mock-card">
                                    <div class="hero-mock-card-head">
                                        <span class="hero-mock-pill">After</span>
                                        <span class="hero-mock-dims">800 × 600 px</span>
                                    </div>
                                    <div class="hero-mock-preview hero-mock-preview--after"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="upload-section" id="upload-section" data-aos="fade-up" data-aos-delay="50">
            <div class="drop-zone" id="drop-zone" role="button" tabindex="0" aria-label="Upload images">
                <i class="bx bx-cloud-upload drop-zone-icon" aria-hidden="true"></i>
                <p class="drop-zone-hint mb-0">Drag and drop your images here, or <span class="drop-zone-accent">click to select</span> files from your computer.</p>
                <input type="file" id="file-input" accept="image/*" multiple>
            </div>
            <div class="file-preview-grid" id="file-preview-grid" hidden></div>
        </div>

        <div class="image-resizer-section-title px-1">Workspace</div>
        <div class="resizer-card p-4 p-lg-5 mb-4" data-aos="fade-up" data-aos-delay="80">
            <div class="resize-settings-top">
                <div class="resize-settings-title-wrap">
                    <div class="resize-settings-icon" aria-hidden="true"><i class="bx bx-slider"></i></div>
                    <div>
                        <h2 class="resize-settings-heading">Resize settings</h2>
                        <p class="resize-settings-sub">Set target size in pixels, inches, centimeters, or as a percentage scale, then lock aspect ratio or cap upscaling before you run the batch.</p>
                    </div>
                </div>
                <div class="resize-tabs-wrap" role="tablist" aria-label="Resize mode">
                    <button type="button" class="tab-pill active" role="tab" aria-selected="true" data-mode="pixels" id="tab-pixels"><i class="bx bx-grid-alt" aria-hidden="true"></i>By pixels</button>
                    <button type="button" class="tab-pill" role="tab" aria-selected="false" data-mode="percent" id="tab-percent"><i class="bx bx-trending-up" aria-hidden="true"></i>By %</button>
                </div>
            </div>

            <div class="row g-4 align-items-stretch">
                <div class="col-lg-7">
                    <div class="resize-workspace-inner h-100">
                        <p class="resize-section-title mb-0">Target dimensions</p>
                        <div id="pixel-inputs">
                            <div class="mt-2 mb-3">
                                <label class="resize-field-label" for="dim-unit"><i class="bx bx-ruler" aria-hidden="true"></i>Unit</label>
                                <select class="form-select form-select-lg" id="dim-unit" aria-describedby="dim-unit-hint">
                                    <option value="px" selected>Pixels (px)</option>
                                    <option value="in">Inches (in)</option>
                                    <option value="cm">Centimeters (cm)</option>
                                </select>
                                <p class="advanced-subtext mb-0 mt-2 small" id="dim-unit-hint">Inches and cm convert using 96 pixels per inch (CSS reference). Exported images use whole pixels.</p>
                            </div>
                            <div class="row g-3 mt-1">
                                <div class="col-sm-6">
                                    <label class="resize-field-label" for="width-px"><i class="bx bx-horizontal-center" aria-hidden="true"></i>Width</label>
                                    <div class="input-group resize-input-group">
                                        <input type="number" class="form-control form-control-lg" id="width-px" min="1" step="1" placeholder="800" value="800" aria-describedby="width-addon">
                                        <span class="input-group-text" id="width-addon">px</span>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <label class="resize-field-label" for="height-px"><i class="bx bx-vertical-center" aria-hidden="true"></i>Height</label>
                                    <div class="input-group resize-input-group">
                                        <input type="number" class="form-control form-control-lg" id="height-px" min="1" step="1" placeholder="600" value="600" aria-describedby="height-addon">
                                        <span class="input-group-text" id="height-addon">px</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="percent-inputs" class="d-none mt-2">
                            <label class="resize-field-label" for="scale-percent"><i class="bx bx-trending-up" aria-hidden="true"></i>Uniform scale</label>
                            <div class="input-group resize-input-group">
                                <input type="number" class="form-control form-control-lg" id="scale-percent" min="1" max="500" value="100" step="1" aria-describedby="scale-addon">
                                <span class="input-group-text" id="scale-addon">%</span>
                            </div>
                            <div class="resize-scale-hint">
                                <i class="bx bx-info-circle"></i>
                                <span>100% keeps each image at its original size. The same percentage applies to every file in the queue.</span>
                            </div>
                        </div>

                        <div class="resize-options-shell">
                            <p class="resize-section-title">Output constraints</p>
                            <label class="resize-option-card" for="maintain-ratio">
                                <input class="form-check-input" type="checkbox" id="maintain-ratio" checked>
                                <span class="resize-option-body">
                                    <span class="resize-option-title">Maintain aspect ratio</span>
                                    <span class="resize-option-desc">Fit inside your width × height box while preserving each image’s proportions.</span>
                                </span>
                            </label>
                            <label class="resize-option-card mb-0" for="no-enlarge">
                                <input class="form-check-input" type="checkbox" id="no-enlarge">
                                <span class="resize-option-body">
                                    <span class="resize-option-title">Do not enlarge if smaller</span>
                                    <span class="resize-option-desc">Skip upscaling — only images larger than the target are reduced.</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="summary-panel h-100">
                        <div class="summary-panel-header">
                            <span class="summary-panel-header-title"><i class="bx bx-clipboard" aria-hidden="true"></i>Live summary</span>
                            <span class="summary-panel-badge">Live</span>
                        </div>
                        <div class="summary-rows">
                            <div class="summary-row">
                                <span class="summary-k">Method</span>
                                <span class="summary-v" id="sum-method">Pixels</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-k">Dimensions</span>
                                <span class="summary-v" id="sum-dims">800 × 600 px</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-k">Output format</span>
                                <span class="summary-v" id="sum-format">JPEG</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-k">Background</span>
                                <span class="summary-v" id="sum-bg">Transparent (PNG/WebP)</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-k">Metadata</span>
                                <span class="summary-v" id="sum-meta">Stripped</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-k">Target file size</span>
                                <span class="summary-v" id="sum-target-size">Off</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="border-secondary opacity-25 my-4">

            <button type="button" class="advanced-toggle" id="advanced-toggle" aria-expanded="false">
                <i class="bx bx-cog advanced-toggle-icon" aria-hidden="true"></i>
                <span>Advanced Options</span>
                <i class="bx bx-chevron-down" id="advanced-chevron" aria-hidden="true"></i>
            </button>
            <div class="advanced-collapse advanced-panel-shell" id="advanced-panel" hidden>
                <div class="collapse-inner p-3 p-lg-4">
                    <div class="row g-4 g-xl-5">
                        <div class="col-lg-6">
                            <h3 class="advanced-block-title">Quality Settings</h3>
                            <p class="advanced-subtext mb-2">Image Quality</p>
                            <div class="advanced-quality-row mb-4">
                                <div class="advanced-range-track">
                                    <input type="range" class="advanced-range" id="quality" min="0" max="100" value="100" step="5" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
                                </div>
                                <span class="advanced-quality-value" id="quality-label">100%</span>
                            </div>

                            <h3 class="advanced-block-title">Metadata Options</h3>
                            <p class="advanced-subtext mb-2">Resized output is drawn on a canvas, so original EXIF/GPS is not copied. Keeping this on documents that exports stay free of embedded camera metadata.</p>
                            <div class="advanced-check mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="strip-meta" checked>
                                    <label class="form-check-label" for="strip-meta">Strip metadata from export (recommended)</label>
                                </div>
                                <div class="form-check mb-0">
                                    <input class="form-check-input" type="checkbox" id="optimize-web">
                                    <label class="form-check-label" for="optimize-web">Optimize Images for Web</label>
                                </div>
                            </div>

                            <h3 class="advanced-block-title">Target File Size</h3>
                            <p class="advanced-subtext mb-2" id="target-file-size-desc">For JPEG and WebP only: lowers quality as needed so each file stays under your limit. PNG is lossless, so this option does not apply.</p>
                            <div class="advanced-check mb-1" id="target-file-size-wrap">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="target-file-size-enable">
                                    <label class="form-check-label" for="target-file-size-enable">Limit File Size</label>
                                </div>
                                <label class="resize-field-label mb-1" for="target-file-size-kb"><i class="bx bx-data" aria-hidden="true"></i>Max size (KB)</label>
                                <div class="input-group resize-input-group">
                                    <input type="number" class="form-control form-control-lg" id="target-file-size-kb" min="5" max="51200" value="250" step="5" aria-describedby="target-file-size-desc">
                                    <span class="input-group-text">KB</span>
                                </div>
                            </div>

                            <h3 class="advanced-block-title">Output Format</h3>
                            <div class="row g-2">
                                <div class="col-12 col-sm-4">
                                    <div class="format-card selected" data-mime="image/jpeg" role="button" tabindex="0">
                                        <span class="format-card-icon"><i class="bx bxs-image"></i></span>
                                        <div class="format-card-name">JPG</div>
                                        <div class="format-card-desc">Best for Photos</div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <div class="format-card" data-mime="image/png" role="button" tabindex="0">
                                        <span class="format-card-icon"><i class="bx bx-image-alt"></i></span>
                                        <div class="format-card-name">PNG</div>
                                        <div class="format-card-desc">Supports Transparency</div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <div class="format-card" data-mime="image/webp" role="button" tabindex="0">
                                        <span class="format-card-icon"><i class="bx bxs-image"></i></span>
                                        <div class="format-card-name">WebP</div>
                                        <div class="format-card-desc">Modern Format</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <h3 class="advanced-block-title">Background Color</h3>
                            <p class="advanced-subtext mb-3">Used when Flattening Transparency (e.g. for JPEG).</p>
                            <div class="d-flex flex-wrap gap-4 gap-lg-5 mb-4 pb-2">
                                <div class="bg-swatch-group">
                                    <button type="button" class="bg-swatch transparent active" data-bg="transparent" aria-label="Transparent background">
                                        <span class="bg-swatch-none-text">None</span>
                                    </button>
                                    <span class="bg-swatch-label">None</span>
                                    <span class="bg-swatch-hint">Transparent</span>
                                </div>
                                <div class="bg-swatch-group">
                                    <button type="button" class="bg-swatch white" data-bg="white" aria-label="White background"></button>
                                    <span class="bg-swatch-label">White</span>
                                </div>
                                <div class="bg-swatch-group">
                                    <button type="button" class="bg-swatch black" data-bg="black" aria-label="Black background"></button>
                                    <span class="bg-swatch-label">Black</span>
                                </div>
                            </div>

                            <h3 class="advanced-block-title">Bulk Rename Options</h3>
                            <label class="advanced-rename-label" for="base-name">Base Name (optional)</label>
                            <input type="text" class="form-control mb-3 rounded-3" id="base-name" placeholder="e.g., vacation-">
                            <div class="advanced-check mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="name-dims">
                                    <label class="form-check-label" for="name-dims">Include Dimensions in Filename</label>
                                </div>
                                <div class="form-check mb-0">
                                    <input class="form-check-input" type="checkbox" id="name-original" checked>
                                    <label class="form-check-label" for="name-original">Include Original Filename</label>
                                </div>
                            </div>
                            <div class="preview-filename-wrap">
                                <label>Output Filename Preview:</label>
                                <div class="preview-filename" id="name-preview" aria-live="polite">[Original-Name].jpg</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center pt-4 mt-2">
                <button type="button" class="btn btn-resize" id="btn-resize" disabled>
                    <i class="bx bx-expand-alt me-2"></i><span id="btn-resize-text">Resize 0 Images</span>
                </button>
            </div>
        </div>

        <div id="results-section" class="results-section" hidden data-aos="fade-up">
            <p class="image-resizer-section-title px-1 mb-2">Export queue</p>
            <p class="small mb-2 px-1" style="color: var(--image-resizer-text-muted);">Process First, Then Download Each File From the Table.</p>
            <div class="results-table-card">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th class="text-start">Name</th>
                            <th class="text-center">Original</th>
                            <th class="text-center">New Size</th>
                            <th class="text-center">Format</th>
                            <th class="text-center"> File Size</th>
                            <th class="text-end">Status</th>
                            <th class="text-center">Download</th>
                        </tr>
                    </thead>
                    <tbody id="results-tbody"></tbody>
                </table>
            </div>
            <div class="results-actions">
                <button type="button" class="btn-download-all" id="btn-download-all" disabled>
                    <i class="bx bx-archive-in"></i>ZIP Download
                </button>
            </div>
        </div>

    </main>


    <div id="toast-el" class="app-toast" role="alert" aria-live="polite">
        <button type="button" class="toast-close" id="toast-close" aria-label="Dismiss">&times;</button>
        <span id="toast-body"></span>
    </div>

    <button type="button" class="sticky-upload-btn" id="footer-select-btn" aria-label="Select images to resize" title="Select images">
        <i class="bx bx-cloud-upload" aria-hidden="true"></i>
        <span class="sticky-upload-label">Select images</span>
    </button>

    <canvas id="work-canvas" hidden></canvas>
@endsection

@push('scripts')
    <script src="{{ asset('js/app.js') }}"></script>
@endpush
