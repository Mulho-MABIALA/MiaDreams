<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function download($document)
    {
        // Sécuriser le nom du fichier (éviter path traversal)
        $filename = basename($document);
        $path = public_path('download/' . $filename);

        if (file_exists($path)) {
            return response()->download($path);
        }

        // Chercher aussi dans storage/app/public comme fallback
        if (Storage::disk('public')->exists($filename)) {
            return Storage::disk('public')->download($filename);
        }

        return redirect()->back()->with('error', 'Le document demandé n\'existe pas.');
    }
}
