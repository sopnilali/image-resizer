@extends('layouts.app')

@section('title', 'Contact ImageResizer — Questions, Feedback & Support')
@section('meta_description', 'Get in touch with the ImageResizer team. Send a question, report a bug, or suggest a feature — we usually reply within one business day.')
@section('meta_keywords', 'contact image resizer, image resizer support, image resizer feedback')

@section('content')
    <main class="container page-wrap">
        <section class="page-hero" data-aos="fade-up">
            <span class="page-eyebrow"><i class="bx bx-envelope" aria-hidden="true"></i>Contact</span>
            <h1 class="page-title">Let’s talk about your <span class="text-gradient">image workflow</span></h1>
            <p class="page-lead">
                Questions, bug reports, and feature ideas are all welcome. Send a note and we’ll get back to you —
                usually within one business day.
            </p>
        </section>

        <section class="page-section">
            <div class="row g-4 align-items-stretch">
                <div class="col-lg-7">
                    <div class="contact-form-card h-100" data-aos="fade-up">
                        @if (session('status'))
                            <div class="site-alert" role="status">
                                <i class="bx bx-check-circle" aria-hidden="true"></i>
                                <span>{{ session('status') }}</span>
                            </div>
                        @endif

                        @if (session('error'))
                            <div class="site-alert site-alert--error" role="alert">
                                <i class="bx bx-error-circle" aria-hidden="true"></i>
                                <span>{{ session('error') }}</span>
                            </div>
                        @endif

                        <h2 class="section-heading">Send a message</h2>
                        <p class="section-copy">Fields marked with an asterisk are required.</p>

                        <form method="POST" action="{{ route('contact.store') }}" novalidate>
                            @csrf

                            <div class="row g-3">
                                <div class="col-sm-6">
                                    <label class="form-label site-label" for="name">Name <span aria-hidden="true">*</span></label>
                                    <input type="text" id="name" name="name" value="{{ old('name') }}"
                                           class="form-control site-input @error('name') is-invalid @enderror"
                                           autocomplete="name" required>
                                    @error('name')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-sm-6">
                                    <label class="form-label site-label" for="email">Email <span aria-hidden="true">*</span></label>
                                    <input type="email" id="email" name="email" value="{{ old('email') }}"
                                           class="form-control site-input @error('email') is-invalid @enderror"
                                           autocomplete="email" required>
                                    @error('email')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-12">
                                    <label class="form-label site-label" for="subject">Subject <span aria-hidden="true">*</span></label>
                                    <select id="subject" name="subject"
                                            class="form-select site-input @error('subject') is-invalid @enderror" required>
                                        <option value="" disabled @selected(old('subject') === null)>Choose a topic</option>
                                        @foreach (['General question', 'Bug report', 'Feature request', 'Partnership'] as $topic)
                                            <option value="{{ $topic }}" @selected(old('subject') === $topic)>{{ $topic }}</option>
                                        @endforeach
                                    </select>
                                    @error('subject')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-12">
                                    <label class="form-label site-label" for="message">Message <span aria-hidden="true">*</span></label>
                                    <textarea id="message" name="message" rows="6"
                                              class="form-control site-input @error('message') is-invalid @enderror"
                                              placeholder="Tell us what you’re working on and how we can help."
                                              required>{{ old('message') }}</textarea>
                                    @error('message')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="contact-form-card__footer">
                                <button type="submit" class="btn-site-primary">
                                    <i class="bx bx-send" aria-hidden="true"></i>Send message
                                </button>
                                <p class="contact-form-card__note">
                                    <i class="bx bx-lock-alt" aria-hidden="true"></i>
                                    Your message is only used to reply to this enquiry.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="contact-aside h-100" data-aos="fade-up" data-aos-delay="80">
                        <div class="contact-info-card">
                            <span class="contact-info-card__icon"><i class="bx bx-envelope" aria-hidden="true"></i></span>
                            <div>
                                <h3 class="contact-info-card__title">Email</h3>
                                <p class="contact-info-card__text">
                                    <a href="mailto:support&#64;imageresizer.app">support&#64;imageresizer.app</a>
                                </p>
                            </div>
                        </div>

                        <div class="contact-info-card">
                            <span class="contact-info-card__icon"><i class="bx bxl-facebook" aria-hidden="true"></i></span>
                            <div>
                                <h3 class="contact-info-card__title">Social</h3>
                                <p class="contact-info-card__text">
                                    <a href="https://www.facebook.com/cse.wadud" target="_blank" rel="noopener noreferrer">Message on Facebook</a>
                                </p>
                            </div>
                        </div>

                        <div class="contact-info-card">
                            <span class="contact-info-card__icon"><i class="bx bx-time-five" aria-hidden="true"></i></span>
                            <div>
                                <h3 class="contact-info-card__title">Response time</h3>
                                <p class="contact-info-card__text">Usually within one business day.</p>
                            </div>
                        </div>

                        <div class="surface-card surface-card--accent">
                            <h3 class="contact-info-card__title">Prefer self-service?</h3>
                            <p class="section-copy mb-0">
                                Most answers live on the features page — from target file sizes to batch ZIP exports.
                            </p>
                            <a href="{{ route('features') }}" class="text-link">
                                Browse features <i class="bx bx-right-arrow-alt" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection
