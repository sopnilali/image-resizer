<?php

namespace Tests\Feature;

use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactTest extends TestCase
{
    public function test_contact_form_emails_a_valid_enquiry(): void
    {
        Mail::fake();

        $response = $this->post(route('contact.store'), [
            'name' => 'Sopnil Ali',
            'email' => 'sopnil@example.com',
            'subject' => 'General question',
            'message' => 'I would like to know whether the resizer supports WebP exports.',
        ]);

        $response
            ->assertRedirect(route('contact'))
            ->assertSessionHasNoErrors()
            ->assertSessionHas('status');

        Mail::assertSent(ContactMessage::class, function (ContactMessage $mail): bool {
            return $mail->hasTo(config('mail.contact_to'))
                && $mail->senderEmail === 'sopnil@example.com'
                && $mail->topic === 'General question';
        });
    }

    public function test_contact_form_rejects_invalid_input(): void
    {
        Mail::fake();

        $response = $this->from(route('contact'))->post(route('contact.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'subject' => 'Unknown topic',
            'message' => 'Too short.',
        ]);

        $response
            ->assertRedirect(route('contact'))
            ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);

        Mail::assertNothingSent();
    }
}
