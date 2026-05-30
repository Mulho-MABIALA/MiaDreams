import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function Preloader() {
    const ref = useRef(null);
    useEffect(() => {
        // Se cache définitivement une seule fois au démarrage de l'app
        const el = ref.current;
        if (!el) return;
        const hide = () => { el.style.display = 'none'; };
        // Écoute la fin de l'animation CSS plFade
        el.addEventListener('animationend', hide);
        return () => el.removeEventListener('animationend', hide);
    }, []);
    return (
        <div id="pl" ref={ref}>
            <img src="/img/logo_MIA.png" alt="MIA DREAMS" />
            <div id="pl-bar"><span /></div>
            <p id="pl-txt">Chargement…</p>
        </div>
    );
}

import Home from './pages/Home';
import APropos from './pages/APropos';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';
import BlogIndex from './pages/Blog/Index';
import BlogShow from './pages/Blog/Show';
import MiaDreams from './pages/Brands/MiaDreams';
import Mprew from './pages/Brands/Mprew';
import PersonalBranding from './pages/Brands/PersonalBranding';
import FashionProgram from './pages/Brands/FashionProgram';
import Brand from './pages/Brands/Brand';
import Gallery from './pages/Gallery';
import Catalogues from './pages/Catalogues';
import Search from './pages/Search';
import Login from './pages/Login';
import Admin from './pages/Admin/index';
import BoutiqueIndex from './pages/Boutique/Index';
import BoutiqueProduct from './pages/Boutique/Product';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import CommandeSucces from './pages/CommandeSucces';
import CommandeErreur from './pages/CommandeErreur';
import MesCommandes from './pages/MesCommandes';
import CommandeSuivi from './pages/CommandeSuivi';
import NotFound from './pages/NotFound';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export default function App() {
    return (
        <>
            <Preloader />
            <ScrollToTop />
            <Routes>
                <Route path="/"                 element={<Home />} />
                <Route path="/apropos"          element={<APropos />} />
                <Route path="/impact"           element={<Impact />} />
                <Route path="/contact"          element={<Contact />} />
                <Route path="/reservation"      element={<Reservation />} />
                <Route path="/blog"             element={<BlogIndex />} />
                <Route path="/blog/:slug"       element={<BlogShow />} />
                <Route path="/miaDreams"        element={<MiaDreams />} />
                <Route path="/mprew"            element={<Mprew />} />
                <Route path="/personalBranding" element={<PersonalBranding />} />
                <Route path="/fashionProgram"   element={<FashionProgram />} />
                <Route path="/marque/:slug"     element={<Brand />} />
                <Route path="/galerie"          element={<Gallery />} />
                <Route path="/catalogues"       element={<Catalogues />} />
                <Route path="/recherche"        element={<Search />} />
                <Route path="/boutique"             element={<BoutiqueIndex />} />
                <Route path="/boutique/:slug"    element={<BoutiqueProduct />} />
                <Route path="/panier"            element={<Panier />} />
                <Route path="/commande"          element={<Commande />} />
                <Route path="/commande/succes/:id"  element={<CommandeSucces />} />
                <Route path="/commande/erreur/:id"  element={<CommandeErreur />} />
                <Route path="/mes-commandes"     element={<MesCommandes />} />
                <Route path="/commande/suivi"           element={<CommandeSuivi />} />
                <Route path="/commande/suivi/:number"   element={<CommandeSuivi />} />
                <Route path="/login"             element={<Login />} />
                <Route path="/admin/*"           element={<Admin />} />
                <Route path="*"                 element={<NotFound />} />
            </Routes>
        </>
    );
}
