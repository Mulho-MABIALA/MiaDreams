@section('title','MPREW — MIA DREAMS & CO')
@section('meta_description','MPREW par MIA DREAMS & CO — prêt-à-porter africain contemporain, collections en série limitée.')
@include('layouts.header')

<div class="container-fluid mprew-container-1 ">

</div>
<div class="container mprew-container-2 ">
    <div class="video-presentation-1">
        <iframe width="1300" height="450" src="https://www.youtube.com/embed/INho0oVn2Ao" frameborder="0"
            allowfullscreen></iframe>
    </div>
</div>
<div class="container mprew-container-3 ">
    <p>
        Ma petite robe en wax est la première application mobile de co-création entre la cliente et son artisan, qui
        permet de créer et de personnaliser sa robe en quelques clics.
        <br><br>
        A partir d’un avatar 3D et une multitude d’options quant aux choix du tissu, des manches, de l’encolure, vous
        pouvez créer votre robe. Vous serez livré sous 3 semaines.
    </p>
    <video width="150" height="200" controls>
        <source src="{{ asset('video/presentation-mprew.mp4') }}" type="video/mp4">
        Votre navigateur ne prend pas en charge la balise vidéo.
    </video>
    <video width="640" height="360" controls>
        <source src="{{ asset('video/nos-tissus.mp4') }}" type="video/mp4">
        Votre navigateur ne prend pas en charge la balise vidéo.
    </video>
    <img src="{{ asset('img/mprew/processus.jpg') }}" alt="" class="img-mprew ">
</div>
@include('layouts.footer')
