<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmationMail;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;

class NewsletterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listeEmail = Newsletter::all();
        return view('newsletter.list', compact('listeEmail'));
    }

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

    /**
     * Display the specified resource.
     */
    public function show(Newsletter $newsletter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Newsletter $newsletter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Newsletter $newsletter)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Newsletter $newsletter)
    {
        //
    }
}
