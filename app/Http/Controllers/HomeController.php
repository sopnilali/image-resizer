<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    /**
     * Display the image resizer workspace.
     */
    public function __invoke(): View
    {
        return view('home');
    }
}
