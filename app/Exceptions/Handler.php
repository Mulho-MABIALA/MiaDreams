<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        // Rendu React des erreurs HTTP pour les requêtes Inertia et les vraies pages
        if ($e instanceof HttpException && !$request->expectsJson()) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 404, 500, 503])) {
                // Pour les requêtes Inertia (navigation SPA)
                if ($request->header('X-Inertia')) {
                    return Inertia::render('Errors/ServerError', [
                        'status'  => $status,
                        'message' => $e->getMessage() ?: $this->defaultMessage($status),
                    ])->toResponse($request)->setStatusCode($status);
                }

                // Pour les accès directs (première visite), blade template
                if (view()->exists("errors.{$status}")) {
                    return response()->view("errors.{$status}", [
                        'status'  => $status,
                        'message' => $e->getMessage() ?: $this->defaultMessage($status),
                    ], $status);
                }
            }
        }

        return $response;
    }

    private function defaultMessage(int $status): string
    {
        return match($status) {
            403 => 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.',
            404 => 'La page que vous cherchez est introuvable.',
            500 => 'Une erreur serveur s\'est produite. Nous travaillons à la résoudre.',
            503 => 'Le site est temporairement en maintenance. Revenez dans quelques instants.',
            default => 'Une erreur s\'est produite.',
        };
    }
}
