<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="{{ asset('img/icone-miadreams.png') }}" type="image/x-icon">
    @vite(['frontend/css/app.css', 'frontend/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
