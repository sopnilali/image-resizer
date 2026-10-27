<footer class="rt-footer" data-aos="fade-up">
    <div class="container">
        <div class="rt-footer__inner">
            <div class="rt-footer__cta">
                <div class="rt-footer__brand">
                    <img class="rt-footer__logo-img logo-on-dark" src="{{ asset('assets/logo-on-dark.png') }}" alt="ImageResizer" width="640" height="151">
                    <img class="rt-footer__logo-img logo-on-light" src="{{ asset('assets/logo-on-light.png') }}" alt="" aria-hidden="true" width="640" height="151">
                    <div class="rt-footer__tag">Resize Images Fast. Keep Quality. Built to Stay Client-Side.</div>
                </div>

                <div class="rt-footer__social" aria-label="Social links">
                    <a href="https://www.facebook.com/cse.wadud" aria-label="Facebook"><i class="bx bxl-facebook" aria-hidden="true"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="bx bxl-linkedin" aria-hidden="true"></i></a>
                </div>
            </div>

            <div class="rt-footer__cols" role="navigation" aria-label="Footer links">
                <div class="rt-col">
                    <div class="rt-col__title">Product</div>
                    <a href="{{ route('home') }}#upload-section">Image Resizer</a>
                    <a href="{{ route('features') }}">Features</a>
                    <a href="{{ route('about') }}">About</a>
                    <a href="{{ route('contact') }}">Contact</a>
                </div>

                <div class="rt-col">
                    <div class="rt-col__title">Resources</div>
                    <a href="{{ route('home') }}#sum-method">Method</a>
                    <a href="{{ route('home') }}#sum-dims">Dimensions</a>
                    <a href="{{ route('home') }}#sum-format">Output format</a>
                </div>

                <div class="rt-col">
                    <div class="rt-col__title">Tools</div>
                    <a href="{{ route('home') }}#upload-section" class="rt-preset-link" data-preset-w="800" data-preset-h="700">800x700 pixel</a>
                    <a href="{{ route('home') }}#upload-section" class="rt-preset-link" data-preset-w="1000" data-preset-h="800">1000x800 pixel</a>
                    <a href="{{ route('home') }}#upload-section" class="rt-preset-link" data-preset-w="500" data-preset-h="500">500x500 pixel</a>
                    <a href="{{ route('home') }}#upload-section" class="rt-preset-link" data-preset-w="1200" data-preset-h="1200">1200x1200 pixel</a>
                </div>

                <div class="rt-col">
                    <div class="rt-col__title">Legal</div>
                    <a href="#">Terms</a>
                    <a href="#">Privacy</a>
                    <a href="#">Cookie Policy</a>
                    <a href="#">Security</a>
                </div>
            </div>
        </div>

        <div class="rt-footer__bottom">
            <div>&copy; <span id="copyright-year"></span> ImageResizer. All Rights Reserved. Developed by <a style="text-decoration: none; color: var(--image-resizer-accent);" href="https://www.facebook.com/cse.wadud" target="_blank" rel="noopener noreferrer">Wadud</a></div>
            <div class="rt-footer__bottom-links">
                <a href="#">Status</a>
                <a href="{{ asset('sitemap.xml') }}">Sitemap</a>
            </div>
        </div>
    </div>
</footer>
