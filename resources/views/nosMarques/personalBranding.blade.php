@section('title','Personal Branding — MIA DREAMS & CO')
@section('meta_description','Personal Branding & Étiquette par MIA DREAMS & CO — construisez une image forte, élaborez votre garde-robe stratégique au Sénégal.')
@include('layouts.header')
<section>
    <div class="pb-bg  p-md-none">
    </div>
</section>
<section>
    <div class="container-fluid">
        <div class="row px-5">
            <div class="col-md-8">
                <h1 class="pb-text-fr pt-5 ps-3 text-center">Construisez une Image Forte </h1>
                <p class="fs-5 pt-1 para-indif">
                    Dans l'arène numérique d'aujourd'hui, votre image personnelle
                    est le pilier sur lequel repose votre succès professionnel.
                    C'est bien plus qu'une simple esthétique
                    : c'est votre essence, votre récit, votre marque distinctive.
                </p>
                <p class="fs-5 pt-1 para-indif">
                    Au cœur de cette formule, nous explorons les éléments essentiels pour
                    créer une image forte et mémorable. De la définition de votre identité
                    de marque à la gestion de votre présence en ligne, nous mettons en
                    lumière les clés de votre succès personnel et professionnel.

                </p>
                <div class="row pb-2">
                    <div class="col-md-6 text-center pt-3 position-relative">
                        <img src="{{ asset('img/personalbranding/pb-rounded-1.jpg') }}" class="bg-img-3 img-fluid"
                             alt="">
                        <p
                            class="pb-opacity-3 text-center  py-4 d-flex flex-column gap-3 opacity-75 text-white position-absolute">
                            <span class="fw-bold fs-5 span-ind">Demander</span>
                            <span class="fw-bold fs-2 span-anniya">Votre</span>
                            <span class="text-uppercase fw-bold fs-5 span-lastica">BILAN D'IMAGE</span>
                        </p>
                    </div>

                    <div class="col-md-6 pt-3 text-center position-relative">
                        <img src="{{ asset('img/personalbranding/SHOP8.jpg') }}" class="bg-img-2 img-fluid" alt="">
                        <p
                            class="pb-opacity-2 text-center  py-4 d-flex flex-column gap-3 opacity-75 text-white position-absolute">
                            <span class="fw-bold fs-5 span-ind">Retrouver votre AUTHENTICITE</span>
                            <span class="fw-bold fs-2 span-anniya">Elaborer</span>
                            <span class=" text-uppercase fw-bold span-lastica">votre garde-robe stratégique</span>
                        </p>

                    </div>
                </div>
            </div>
            <div class="col-md-4  text-center position-relative">
                <div class="align-middle d-flex ">
                    <img src="{{ asset('img/logo-miadreams-noir.png') }}" alt="" class="img-fluid logo-1">
                </div>
                <img src="{{ asset('img/personalbranding/4e7af837-a1ef-405e-8a13-9e0bf855af23.jfif') }}" alt=""
                     class="bg-img-1 img-fluid">
                <p
                    class="pb-opacity-1 text-center  py-4 d-flex flex-column gap-3 opacity-75 text-white position-absolute">
                    <span class=" fw-bold fs-5  span-ind">Offrez-vous </span>
                    <span class=" fw-bold fs-2 fst-italic span-anniya">Votre</span>
                    <span class="text-uppercase fw-bold fs-5 span-lastica">Brand plateform</span>
                </p>


            </div>
        </div>

        <div class="text-center  py-5">
            <a href="{{ route('download', ['document' => 'Offre_Personal_Branding_2024.pdf']) }}"
               class="btn fs-6 pb-btn p-1 span-lastica">TELECHARGER NOTRE BROCHURE</a>
        </div>
    </div>
</section>
<section>
    <div class="container-fluid bg-beige ">
        <div class="row px-5 ">
            <div class="col-md-5 text-center position-relative">
                <div class="align-middle">
                    <img src={{ asset('img/logo-miadreams-noir.png') }} alt="" class="img-fluid  pb-logo-mia">
                </div>
                <img src={{ asset('img/personalbranding/miadreams-catalogue-3.png') }} alt="" class="bg-img-4 pb-4">

                <a href="{{ route('download', ['document' => 'Catalogue_Personal_Branding_&_Etiquette_3.pdf']) }}"
                   class="btn-brochure-3 text-center opacity-75  text-white position-absolute">
                    TELECHARGER NOTRE<br> CATALOGUE 3
                </a>

            </div>
            <div class="col-md-7">
                <p class="fs-5 pt-5 ps-3 para-indif">
                    MIA DREAMS PERSONAL BRANDING & ETIQUETTE est notre catalogue qui a
                    pour objectif de présenter les nouvelles collections de la marque d'une
                    façon originale de vous présenter nos créations autour d'un art de vivre
                    d'une Afrique contemporaine, et de partager notre univers créatif
                    accompagné de petits articles, de citations, de conseils et astuces bien-être.
                </p>
                <div class="row pb-4">
                    <div class="col-md-6 text-center position-relative pt-4">
                        <img src="{{ asset('img/personalbranding/miadreams-catalogue-2.png') }}" alt=""
                             class="bg-img-5 img-fluid">

                        <a href="{{ route('download', ['document' => 'Catalogue_Personal_Branding_&_Etiquette_2.pdf']) }}"
                           class="btn-brochure-2 opacity-75  text-white position-absolute">
                            TELECHARGER NOTRE<br> CATALOGUE 2
                        </a>
                    </div>

                    <div class="col-md-6 text-center position-relative pt-4 ">
                        <img src={{ asset('img/personalbranding/miadreams-catalogue-1.png') }} alt=""
                             class="bg-img-6 img-fluid">

                        <a href="{{ route('download', ['document' => 'Catalogue_Personal_Branding_&_Etiquette_1.pdf']) }}"
                           class="btn-brochure-1 opacity-75  text-white position-absolute">
                            TELECHARGER NOTRE<br> CATALOGUE 1
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>

@include('layouts.footer')
