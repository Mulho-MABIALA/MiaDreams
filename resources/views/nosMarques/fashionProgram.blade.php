@section('title','Fashion Program — MIA DREAMS & CO')
@section('meta_description','Fashion Program par MIA DREAMS & CO — formation mode africaine, stylisme et personal branding au Sénégal.')
@include('layouts.header')

<!-- Section "Bannière" -->
<div class="fashionContainer-1 container-fluid mt-5">
    <div class="row justify-content-center align-items-center">
        <div class="text-center">
            <h1 class="display-4">NOTRE FASHION PROGRAM</h1>
        </div>
    </div>

</div>
<div class="video-presentation-2 px-5">
    <iframe src="https://www.youtube.com/embed/F1Q2vjh2nms" frameborder="0"
            allowfullscreen></iframe>
</div>
<!-- Section "Mise en oeuvre du programme de formation" -->
<div class="fashionContainer-2 container mt-5 mb-5">
    <div class="row">
        <!-- Section gauche -->
        <div class="sectionLeft col-md-6">
            <h1 class="titre text-center mb-4">MISE EN OEUVRE DU PROGRAMME DE FORMATION</h1>
            <img src="{{asset("img/fashionprogram/fashionProgram-image1.png")}}" class="img-fluid w-100"
                 alt="Mise en œuvre du programme de formation">
        </div>
        <!-- Section droite -->
        <div class="sectionRight col-md-6">
            <div>
                <p>
                    Le projet vise les personnes ayant déjà des notions de couture, apprenti ou confirmé, qui souhaitent
                    se perfectionner, acquérir de nouvelles compétences, et pénétrer le marché national et
                    international. La première cohorte sera au nombre de 12 apprenants, dont 50% de femmes, qui
                    bénéficieront d’une formation pratique de 16 semaines au sein de l’Entreprise Mia Dreams and Co. Le
                    projet a délibérément choisi un petit nombre d’apprenants afin de nous assurer de la qualité, de la
                    bonne compréhension et exécution de l’ensemble des modules dispensés lors du programme.
                </p>
                <p>
                    Les candidats ont été choisis sur la base de critères d’éligibilité tels que : l’âge, les
                    connaissances basiques de mode, savoir écrire et lire, mais aussi réussir des tests techniques. La
                    force de ce projet est basée sur des partenaires techniques de qualité, la mise en application des
                    modules dans l’entreprise Mia Dreams and Co avec la possibilité d’être embauché ou de créer sa
                    propre structure tout en ayant accès aux clients de la plateforme « Ma petite robe en wax ».
                </p>
                <ul class="liste text-white">
                    <li>400 Heures de Formation technique en coupe, couture et finition à la main</li>
                    <li>288 Heures de Formation en littératie et Marketing digital</li>
                    <li>24 Heures de Formation en conseil en image et relation client</li>
                    <li>10 Heures de Formation en communication, prise de parole en public et leadership</li>
                    <li>70 Heures de teintures textiles</li>
                    <li>20 Heures de broderies perlées</li>
                </ul>
            </div>
        </div>
    </div>
    <a class="btn btn-lg btn-block text-white d-block mx-auto p-0 col-md-5"
       href="{{ route('download', ['document' => "Rapport_d'activite_MPREW.pdf"]) }}">TÉLÉCHARGER
        NOTRE RAPPORT D'ACTIVITÉ</a>
</div>

<!-- Section "Design Ton Bubu" -->
<h1 class="design display-4 text-center mb-4">DESIGN TON BUBU</h1>
<div class="fashionContainer-3 container">
    <div class="row">
        <div class="col-md-7">
            <table class="col-md-12">
                <tr>
                    <td><img src="{{asset("img/fashionprogram/fashionProgram-image2.jpg")}}" class="img-fluid w-100 p-2"
                             alt="Design Ton Bubu 1"></td>
                    <td><img src="{{asset("img/fashionprogram/fashionProgram-image3.jpg")}}" class="img-fluid w-100 p-2"
                             alt="Design Ton Bubu 2"></td>
                </tr>
                <tr>
                    <td><img src="{{asset("img/fashionprogram/fashionProgram-image4.jpg")}}" class="img-fluid w-100 p-2"
                             alt="Design Ton Bubu 3"></td>
                    <td><img src="{{asset("img/fashionprogram/fashionProgram-image5.jpg")}}" class="img-fluid w-100 p-2"
                             alt="Design Ton Bubu 4"></td>
                </tr>
            </table>
        </div>
        <div class="col-md-5">
            <br>
            <p>
                L’initiative Design Ton Bubu est une aventure artistique unique, initiée en partenariat avec le British
                Council. Cet événement a réuni quatre designers talentueux du Kenya, de l'Éthiopie, du Zimbabwe et de
                l'Ouganda au Sénégal. Organisé par la structure Mia Dreams and Co,<br><br>
                le défi consistait à explorer
                l'écosystème de la mode sénégalaise et à mettre en valeur la créativité à travers le prisme du bubu, la
                tenue traditionnelle emblématique du pays.
            </p>

        </div>
    </div>
    <p>
        Le British Council a sélectionné ces designers pour une immersion dans la scène de la mode au Sénégal, et Mia
        Dreams a été sollicitée pour concevoir une activité exclusive sur deux jours baptisée "Design Ton Bubu".
        L'objectif était de fusionner la richesse de la tradition avec l'innovation contemporaine, en utilisant le bubu
        comme point de départ pour des créations originales.
    </p>
    <a class="btn btn-lg btn-block text-white d-block mx-auto p-0 col-md-5"
       href="{{ route('download', ['document' => "RAPPORT_DESIGN_TON_BUBU_FR.pdf"]) }}">TÉLÉCHARGER
        NOTRE RAPPORT D'ACTIVITÉ</a>
</div>

<!-- Section "Soutenez nos différentes initiatives pour donner accès à la FORMATION" -->
<div class="fashionContainer-4 container-fluid position-relative">
    <!--<img src="{{asset("img/fashionprogram/fashionProgram-image6.jpg")}}" class="img-fluid w-100"
         alt="Soutenez nos différentes initiatives pour donner accès à la FORMATION">-->
    <div class="position-absolute top-0 start-50 translate-middle-x text-center mt-3"
         style="transform: translateX(-50%);">
        <h6 class="text-white">
            SOUTENEZ NOS DIFFERENTES <br>INITIATIVES <br> POUR DONNER ACCES À LA FORMATION
        </h6>
    </div>
</div>


@include('layouts.footer')
