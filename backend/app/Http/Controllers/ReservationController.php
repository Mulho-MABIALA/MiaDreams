<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Reservation', [
            'services'        => Reservation::services(),
            'selectedService' => $request->get('service'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:20',
            'service'        => 'required|string',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string|max:10',
            'message'        => 'nullable|string|max:2000',
        ], [
            'name.required'    => 'Le nom est obligatoire.',
            'email.required'   => 'L\'email est obligatoire.',
            'email.email'      => 'L\'email n\'est pas valide.',
            'service.required' => 'Veuillez choisir un service.',
            'preferred_date.after' => 'La date doit être dans le futur.',
        ]);

        Reservation::create($validated);

        return back()->with('success', 'Votre demande de réservation a bien été envoyée ! Nous vous contacterons dans les 24h pour confirmer.');
    }
}
