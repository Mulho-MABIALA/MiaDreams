<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
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

        if ($e instanceof HttpException && !$request->expectsJson()) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 404, 500, 503], true)) {
                $page = $status === 404 ? 'Errors/NotFound' : 'Errors/ServerError';

                return Inertia::render($page, [
                    'status' => $status,
                    'message' => $e->getMessage() ?: $this->defaultMessage($status),
                ])->toResponse($request)->setStatusCode($status);
            }
        }

        return $response;
    }

    private function defaultMessage(int $status): string
    {
        return match ($status) {
            403 => 'Vous n\'avez pas l\'autorisation d\'acceder a cette page.',
            404 => 'La page que vous cherchez est introuvable.',
            500 => 'Une erreur serveur s\'est produite. Nous travaillons a la resoudre.',
            503 => 'Le site est temporairement en maintenance. Revenez dans quelques instants.',
            default => 'Une erreur s\'est produite.',
        };
    }
}
