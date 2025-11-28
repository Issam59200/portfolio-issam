<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a new contact message
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contact = Contact::create($validated);

        // TODO: Envoyer une notification email à l'admin

        return response()->json([
            'message' => 'Message envoyé avec succès',
            'contact' => $contact,
        ], 201);
    }

    /**
     * Display all contact messages (admin only)
     */
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json($contacts);
    }

    /**
     * Mark contact as read (admin only)
     */
    public function markAsRead(Contact $contact)
    {
        $contact->update(['read' => true]);

        return response()->json([
            'message' => 'Message marqué comme lu',
            'contact' => $contact,
        ]);
    }

    /**
     * Delete contact message (admin only)
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès',
        ]);
    }
}
