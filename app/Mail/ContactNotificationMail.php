<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '📩 Nouveau message de ' . $this->contactMessage->name . ' — ' . $this->contactMessage->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mails.contact-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
