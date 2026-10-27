@extends('layouts.app')

@section('title', 'About ImageResizer — Private, Fast Image Resizing')
@section('meta_description', 'Learn how ImageResizer helps you resize, convert, and export images with pixel-perfect control — entirely inside your browser, with no uploads.')
@section('meta_keywords', 'about image resizer, private image resizing, browser image editor, client-side image tool')

@section('content')
    <main class="container page-wrap">
        <section class="page-hero" data-aos="fade-up">
            <span class="page-eyebrow"><i class="bx bx-sparkles" aria-hidden="true"></i>About ImageResizer</span>
            <h1 class="page-title">Premium image tooling with <span class="text-gradient">zero uploads</span></h1>
            <p class="page-lead">
                ImageResizer was built for people who need exact dimensions, clean exports, and a workflow that respects
                their files. Every image is processed on your device — never sent to a server.
            </p>
            <div class="page-actions">
                <a href="{{ route('home') }}#upload-section" class="btn-site-primary">
                    <i class="bx bx-cloud-upload" aria-hidden="true"></i>Resize an image
                </a>
                <a href="{{ route('features') }}" class="btn-site-ghost">
                    <i class="bx bx-grid-alt" aria-hidden="true"></i>Explore features
                </a>
            </div>
        </section>

        <section class="page-section" aria-label="ImageResizer at a glance">
            <div class="stat-grid">
                <div class="stat-card" data-aos="fade-up" data-aos-delay="50">
                    <span class="stat-card__value">0</span>
                    <span class="stat-card__label">Files uploaded</span>
                    <p class="stat-card__hint">Processing happens in your browser tab.</p>
                </div>
                <div class="stat-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="stat-card__value">3</span>
                    <span class="stat-card__label">Export formats</span>
                    <p class="stat-card__hint">JPG, PNG, and WebP with quality control.</p>
                </div>
                <div class="stat-card" data-aos="fade-up" data-aos-delay="150">
                    <span class="stat-card__value">100%</span>
                    <span class="stat-card__label">Client-side</span>
                    <p class="stat-card__hint">No account, no storage, no tracking of your images.</p>
                </div>
                <div class="stat-card" data-aos="fade-up" data-aos-delay="200">
                    <span class="stat-card__value">Batch</span>
                    <span class="stat-card__label">Ready by default</span>
                    <p class="stat-card__hint">Queue multiple files and export them in one ZIP.</p>
                </div>
            </div>
        </section>

        <section class="page-section">
            <div class="row g-4 align-items-stretch">
                <div class="col-lg-7">
                    <article class="surface-card h-100" data-aos="fade-up">
                        <h2 class="section-heading">Why we built it</h2>
                        <p class="section-copy">
                            Most online resizers ask you to upload personal photos to an unknown server just to change a
                            width value. That trade-off never felt right. ImageResizer flips the model: the tool loads in
                            your browser, the canvas does the work locally, and your files never leave your machine.
                        </p>
                        <p class="section-copy mb-0">
                            The result is a fast, private workspace with the controls professionals actually need —
                            exact pixel bounds, unit conversion, aspect-ratio locking, metadata stripping, and
                            predictable export settings.
                        </p>

                        <ul class="check-list">
                            <li><i class="bx bx-check" aria-hidden="true"></i>No sign-up, no watermarks, no file limits</li>
                            <li><i class="bx bx-check" aria-hidden="true"></i>Pixel, percentage, inch, and centimeter inputs</li>
                            <li><i class="bx bx-check" aria-hidden="true"></i>Quality and target file-size controls for JPEG and WebP</li>
                            <li><i class="bx bx-check" aria-hidden="true"></i>Clean filenames with optional dimension suffixes</li>
                        </ul>
                    </article>
                </div>
                <div class="col-lg-5">
                    <aside class="surface-card surface-card--accent h-100" data-aos="fade-up" data-aos-delay="80">
                        <span class="page-eyebrow"><i class="bx bx-lock-alt" aria-hidden="true"></i>Privacy by design</span>
                        <h2 class="section-heading">Your files stay yours</h2>
                        <p class="section-copy">
                            There is no upload endpoint behind this app. The resize pipeline runs entirely on the HTML
                            canvas in your browser, so photos, screenshots, and client work never touch a server.
                        </p>
                        <div class="privacy-points">
                            <div class="privacy-point">
                                <i class="bx bx-shield-check" aria-hidden="true"></i>
                                <div>
                                    <strong>On-device processing</strong>
                                    <span>Images are decoded and re-encoded locally.</span>
                                </div>
                            </div>
                            <div class="privacy-point">
                                <i class="bx bx-data" aria-hidden="true"></i>
                                <div>
                                    <strong>Metadata stripped</strong>
                                    <span>EXIF and GPS data are not copied to exports.</span>
                                </div>
                            </div>
                            <div class="privacy-point">
                                <i class="bx bx-time-five" aria-hidden="true"></i>
                                <div>
                                    <strong>Session-only queue</strong>
                                    <span>Closing the tab clears the working files.</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <section class="page-section">
            <header class="section-header">
                <span class="page-eyebrow"><i class="bx bx-heart" aria-hidden="true"></i>What we value</span>
                <h2 class="section-heading">Built around four simple promises</h2>
                <p class="section-copy">The product stays intentionally small, fast, and honest about what it does.</p>
            </header>

            <div class="value-grid">
                <article class="value-card" data-aos="fade-up">
                    <span class="value-card__icon"><i class="bx bx-shield-quarter" aria-hidden="true"></i></span>
                    <h3 class="value-card__title">Privacy first</h3>
                    <p class="value-card__text">No uploads, no image storage, and no hidden server pipeline.</p>
                </article>
                <article class="value-card" data-aos="fade-up" data-aos-delay="50">
                    <span class="value-card__icon"><i class="bx bx-bolt-circle" aria-hidden="true"></i></span>
                    <h3 class="value-card__title">Fast by default</h3>
                    <p class="value-card__text">Instant previews, batched exports, and no round trips to a backend.</p>
                </article>
                <article class="value-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="value-card__icon"><i class="bx bx-ruler" aria-hidden="true"></i></span>
                    <h3 class="value-card__title">Precise output</h3>
                    <p class="value-card__text">Exact pixels, sensible defaults, and predictable filenames.</p>
                </article>
                <article class="value-card" data-aos="fade-up" data-aos-delay="150">
                    <span class="value-card__icon"><i class="bx bx-smile" aria-hidden="true"></i></span>
                    <h3 class="value-card__title">No friction</h3>
                    <p class="value-card__text">No accounts or paywalls. Open the page and start resizing.</p>
                </article>
            </div>
        </section>

        <section class="cta-band" data-aos="fade-up">
            <div>
                <h2 class="cta-band__title">Ready to resize without uploading?</h2>
                <p class="cta-band__text">Open the workspace and export your first batch in under a minute.</p>
            </div>
            <a href="{{ route('home') }}#upload-section" class="btn-site-primary">
                <i class="bx bx-cloud-upload" aria-hidden="true"></i>Start resizing
            </a>
        </section>
    </main>
@endsection
