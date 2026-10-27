@extends('layouts.app')

@section('title', 'Features — Pixel-Perfect Resizing, Batch Export & More')
@section('meta_description', 'Explore ImageResizer features: exact pixel resizing, aspect ratio locking, JPG/PNG/WebP export, batch ZIP downloads, target file size, metadata stripping, and bulk rename.')
@section('meta_keywords', 'image resizer features, batch image resize, webp converter, target file size, strip exif')

@section('content')
    <main class="container page-wrap">
        <section class="page-hero" data-aos="fade-up">
            <span class="page-eyebrow"><i class="bx bx-grid-alt" aria-hidden="true"></i>Features</span>
            <h1 class="page-title">Everything you need to <span class="text-gradient">ship clean images</span></h1>
            <p class="page-lead">
                A focused toolkit for web-ready visuals: precise dimensions, the right format, sensible compression,
                and a batch workflow that stays entirely on your device.
            </p>
            <div class="page-actions">
                <a href="{{ route('home') }}#upload-section" class="btn-site-primary">
                    <i class="bx bx-cloud-upload" aria-hidden="true"></i>Try the workspace
                </a>
                <a href="{{ route('contact') }}" class="btn-site-ghost">
                    <i class="bx bx-envelope" aria-hidden="true"></i>Ask a question
                </a>
            </div>
        </section>

        <section class="page-section" aria-label="Feature list">
            <div class="feature-grid">
                <article class="feature-card" data-aos="fade-up">
                    <span class="feature-card__icon"><i class="bx bx-ruler" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Exact pixel control</h2>
                    <p class="feature-card__text">Set the target width and height in pixels, inches, or centimeters and export whole-pixel images every time.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="50">
                    <span class="feature-card__icon"><i class="bx bx-link" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Aspect ratio lock</h2>
                    <p class="feature-card__text">Fit images inside a bounding box without stretching. Optional no-enlarge guard prevents upscaling small assets.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="feature-card__icon"><i class="bx bx-image-alt" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">JPG, PNG &amp; WebP</h2>
                    <p class="feature-card__text">Pick the right format for photos, transparency, or modern delivery — with quality control where it matters.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="150">
                    <span class="feature-card__icon"><i class="bx bx-archive-in" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Batch + ZIP export</h2>
                    <p class="feature-card__text">Queue multiple files, process them in one run, then download individual results or the whole set as a ZIP.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <span class="feature-card__icon"><i class="bx bx-tachometer" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Target file size</h2>
                    <p class="feature-card__text">For JPEG and WebP, cap exports under a KB limit by lowering quality automatically until the size fits.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="250">
                    <span class="feature-card__icon"><i class="bx bx-shield-check" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Metadata stripping</h2>
                    <p class="feature-card__text">Canvas-based exports leave EXIF and GPS behind, so shared images carry only what you intend.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="300">
                    <span class="feature-card__icon"><i class="bx bx-rename" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">Bulk rename</h2>
                    <p class="feature-card__text">Add a base name, keep the original filename, or append dimensions — with a live preview before export.</p>
                </article>
                <article class="feature-card" data-aos="fade-up" data-aos-delay="350">
                    <span class="feature-card__icon"><i class="bx bx-lock-alt" aria-hidden="true"></i></span>
                    <h2 class="feature-card__title">100% on-device</h2>
                    <p class="feature-card__text">No uploads, accounts, or server storage. Your images are processed inside the browser tab.</p>
                </article>
            </div>
        </section>

        <section class="page-section">
            <header class="section-header">
                <span class="page-eyebrow"><i class="bx bx-list-ol" aria-hidden="true"></i>How it works</span>
                <h2 class="section-heading">Three steps to production-ready images</h2>
                <p class="section-copy">No setup, no install — the entire workflow lives on one page.</p>
            </header>

            <div class="step-grid">
                <article class="step-card">
                    <span class="step-card__number">01</span>
                    <h3 class="step-card__title">Drop your images</h3>
                    <p class="step-card__text">Drag a batch into the upload zone or pick files from your device. Previews appear instantly.</p>
                </article>
                <article class="step-card">
                    <span class="step-card__number">02</span>
                    <h3 class="step-card__title">Dial in the output</h3>
                    <p class="step-card__text">Choose dimensions, aspect ratio, format, quality, background, and filename rules.</p>
                </article>
                <article class="step-card">
                    <span class="step-card__number">03</span>
                    <h3 class="step-card__title">Export the batch</h3>
                    <p class="step-card__text">Resize everything in one run, then download files individually or as a single ZIP archive.</p>
                </article>
            </div>
        </section>

        <section class="cta-band" data-aos="fade-up">
            <div>
                <h2 class="cta-band__title">See the toolkit in action</h2>
                <p class="cta-band__text">The workspace is free, private, and ready right now.</p>
            </div>
            <a href="{{ route('home') }}#upload-section" class="btn-site-primary">
                <i class="bx bx-cloud-upload" aria-hidden="true"></i>Open the resizer
            </a>
        </section>
    </main>
@endsection
