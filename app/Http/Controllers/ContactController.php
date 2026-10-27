<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use Illuminate\Http\JsonResponse;
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
    public function store(Request $request): JsonResponse|RedirectResponse
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

            $errorMessage = 'Sorry, your message could not be sent right now. Please try again in a few minutes.';

            if ($request->expectsJson()) {
                return response()->json(['message' => $errorMessage], 500);
            }

            return back()
                ->withInput()
                ->with('error', $errorMessage);
        }

        $statusMessage = "Thanks, {$validated['name']}! Your message has been sent and we'll reply to {$validated['email']} soon.";

        if ($request->expectsJson()) {
            return response()->json(['message' => $statusMessage]);
        }

        return redirect()
            ->route('contact')
            ->with('status', $statusMessage);
    }
}
