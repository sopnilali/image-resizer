<?php

namespace Tests\Feature;

use Tests\TestCase;

class PageTest extends TestCase
{
    public function test_home_page_is_available(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertViewIs('home')
            ->assertSee('Resize images in pixels');
    }

    public function test_about_page_is_available(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertSee('About ImageResizer');
    }

    public function test_features_page_is_available(): void
    {
        $this->get(route('features'))
            ->assertOk()
            ->assertSee('JPG, PNG');
    }

    public function test_contact_page_is_available(): void
    {
        $this->get(route('contact'))
            ->assertOk()
            ->assertSee('Send a message');
    }

    public function test_navigation_highlights_the_active_page(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertSee('site-nav__link is-active', false);
    }
}
