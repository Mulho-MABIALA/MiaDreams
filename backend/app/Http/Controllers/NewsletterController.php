<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmationMail;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ], [
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email'    => 'L\'adresse email n\'est pas valide.',
            'email.unique'   => 'Cette adresse email est déjà inscrite à notre newsletter.',
        ]);

        try {
            Newsletter::create(['email' => $request->email]);

            // Envoyer l'e-mail de confirmation
            Mail::to($request->email)->send(new ConfirmationMail());

            return redirect()->back()->with('newsletter_success', 'Merci ! Votre inscription à la newsletter a bien été enregistrée. 🎉');
        } catch (\Exception $e) {
            return redirect()->back()->with('newsletter_error', 'Une erreur est survenue. Veuillez réessayer.');
        }
    }

}
