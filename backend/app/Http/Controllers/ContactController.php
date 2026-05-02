<?php
namespace App\Http\Controllers;
use App\Mail\ContactConfirmationMail;
use App\Mail\ContactNotificationMail;
use App\Models\ContactMessage;
use App\Models\CompanyInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email n\'est pas valide.',
            'subject.required' => 'Le sujet est obligatoire.',
            'message.required' => 'Le message est obligatoire.',
            'message.min' => 'Le message doit contenir au moins 10 caractères.',
        ]);

        $message = ContactMessage::create($validated);

        // 1. Notifier MIA DREAMS (email interne)
        try {
            $companyInfo = CompanyInfo::first();
            $recipientEmail = $companyInfo?->email ?? config('mail.from.address');
            Mail::to($recipientEmail)->send(new ContactNotificationMail($message));
        } catch (\Exception $e) {
            // Non critique
        }

        // 2. Confirmer au visiteur que son message a été reçu
        try {
            Mail::to($message->email)->send(new ContactConfirmationMail($message));
        } catch (\Exception $e) {
            // Non critique
        }

        return back()->with('success', 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
    }
}
