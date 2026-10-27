@php
    $navigation = [
        ['route' => 'home', 'label' => 'Home', 'icon' => 'bx-home-alt'],
        ['route' => 'about', 'label' => 'About', 'icon' => 'bx-info-circle'],
        ['route' => 'features', 'label' => 'Features', 'icon' => 'bx-grid-alt'],
        ['route' => 'contact', 'label' => 'Contact', 'icon' => 'bx-envelope'],
    ];
@endphp

<header class="site-header" id="site-header">
    <div class="container">
        <div class="site-header__bar">
            <a class="site-brand" href="{{ route('home') }}" aria-label="ImageResizer home">
                <img class="site-brand__logo logo-on-dark" src="{{ asset('assets/logo-on-dark.png') }}" alt="ImageResizer" width="640" height="151">
                <img class="site-brand__logo logo-on-light" src="{{ asset('assets/logo-on-light.png') }}" alt="" aria-hidden="true" width="640" height="151">
            </a>

            <nav class="site-nav" aria-label="Primary navigation">
                @foreach ($navigation as $item)
                    <a href="{{ route($item['route']) }}"
                       class="site-nav__link{{ request()->routeIs($item['route']) ? ' is-active' : '' }}"
                       @if (request()->routeIs($item['route'])) aria-current="page" @endif>
                        {{ $item['label'] }}
                    </a>
                @endforeach
            </nav>

            <div class="site-header__actions">
                <a href="{{ route('home') }}#upload-section" class="site-header__cta">
                    <i class="bx bx-upload" aria-hidden="true"></i>
                    <span>Start resizing</span>
                </a>
                <button type="button" class="btn-theme-toggle" id="theme-toggle" aria-label="Switch to light mode" title="Light mode">
                    <i class="bx bx-sun" aria-hidden="true"></i>
                </button>
                <button type="button" class="site-nav-toggle" id="site-nav-toggle" aria-label="Open menu" aria-controls="site-mobile-nav" aria-expanded="false">
                    <i class="bx bx-menu" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="site-mobile" id="site-mobile-nav">
        <nav class="container site-mobile__nav" aria-label="Mobile navigation">
            @foreach ($navigation as $item)
                <a href="{{ route($item['route']) }}"
                   class="site-mobile__link{{ request()->routeIs($item['route']) ? ' is-active' : '' }}"
                   @if (request()->routeIs($item['route'])) aria-current="page" @endif>
                    <i class="bx {{ $item['icon'] }}" aria-hidden="true"></i>
                    <span>{{ $item['label'] }}</span>
                </a>
            @endforeach
            <a href="{{ route('home') }}#upload-section" class="site-mobile__cta">
                <i class="bx bx-upload" aria-hidden="true"></i>
                <span>Start resizing</span>
            </a>
        </nav>
    </div>
</header>
