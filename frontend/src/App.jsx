import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
import NotFound from './pages/NotFound';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export default function App() {
    return (
        <>
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
                <Route path="*"                 element={<NotFound />} />
            </Routes>
        </>
    );
}
