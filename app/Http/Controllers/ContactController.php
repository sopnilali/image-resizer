<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Throwable;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function show(): View
    {
        return view('pages.contact');
    }

    /**
     * Validate the enquiry and email it to the configured inbox.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'in:General question,Bug report,Feature request,Partnership'],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
        ]);

        try {
            Mail::to(config('mail.contact_to'))
                ->send(new ContactMessage(
                    senderName: $validated['name'],
                    senderEmail: $validated['email'],
                    topic: $validated['subject'],
                    messageBody: $validated['message'],
                ));
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('error', 'Sorry, your message could not be sent right now. Please try again in a few minutes.');
        }

        return redirect()
            ->route('contact')
            ->with('status', "Thanks, {$validated['name']}! Your message has been sent and we'll reply to {$validated['email']} soon.");
    }
}
