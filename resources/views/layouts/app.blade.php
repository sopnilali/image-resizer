<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#05080f">
    <meta name="title" content="@yield('meta_title', 'Best Image Resizer Tool - Resize Images Quickly Without Losing Quality')">
    <meta name="description" content="@yield('meta_description', 'Use the best image resizer online to resize images fast without losing quality. Compress, adjust dimensions, and optimize photos for web, social media.')">
    <meta name="keywords" content="@yield('meta_keywords', 'image resizer, image resize, image converter, image convert, image resize online, image convert online, image resize free, image convert free, image resize tool, image convert tool, image resize app, image convert app')">
    <meta name="author" content="Wadud">
    <meta name="robots" content="index, follow">
    <meta name="google-site-verification" content="HVz3aCVQcKD0bub-Ksu7cEaEt0hSK-qnwTECbv0Jvn8" />
    <link rel="canonical" href="{{ url()->current() }}">
    <title>@yield('title', 'Best Image Resizer Tool - Resize Images Quickly Without Losing Quality')</title>

    <script>
        (function () {
            try {
                var stored = localStorage.getItem('image-resizer-theme');
                if (stored === 'light' || stored === 'dark') {
                    document.documentElement.setAttribute('data-theme', stored);
                } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            } catch (e) {}
        })();
    </script>

    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/favicon-16x16.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}?v={{ filemtime(public_path('css/style.css')) }}">
</head>
<body class="@yield('body_class', 'image-resizer-page')">
    @include('partials.header')

    @yield('content')

    @include('partials.footer')

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
    @stack('scripts')
    <script src="{{ asset('js/site.js') }}?v={{ filemtime(public_path('js/site.js')) }}"></script>
</body>
</html>
