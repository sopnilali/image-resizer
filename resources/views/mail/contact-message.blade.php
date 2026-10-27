<x-mail::message>
# New contact enquiry

**Name:** {{ $senderName }}
**Email:** {{ $senderEmail }}
**Topic:** {{ $topic }}

---

{{ $messageBody }}

<x-mail::button :url="'mailto:'.$senderEmail">
Reply to {{ $senderName }}
</x-mail::button>

Sent from {{ config('app.name') }}.
</x-mail::message>
