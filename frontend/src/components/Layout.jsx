import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import NewsletterPopup from './NewsletterPopup';

function Preloader() {
    return (
        <div id="pl">
            <img src="/img/logo_MIA.png" alt="MIA DREAMS" />
            <div id="pl-bar"><span /></div>
            <p id="pl-txt">Chargement…</p>
        </div>
    );
}

export default function Layout({ children, title, hideNewsletter = false }) {
    const { pathname } = useLocation();

    // Mettre à jour le title de la page
    useEffect(() => {
        document.title = title ? `${title} — MIA DREAMS & CO` : 'MIA DREAMS & CO';
    }, [title]);

    // Scroll reveal à chaque navigation
    useEffect(() => {
        const runReveal = () => {
            const obs = new IntersectionObserver(entries => {
                entries.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); });
            }, { threshold: 0.08 });
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
            return obs;
        };
        const obs = runReveal();
        return () => obs.disconnect();
    }, [pathname]);

    return (
        <>
            <Preloader />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
            {!hideNewsletter && <NewsletterPopup />}
        </>
    );
}
