import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import NewsletterPopup from './NewsletterPopup';

function Preloader() {
    return (
        <div id="pl">
            <img src="/img/logo_MIA.png" alt="MIA DREAMS" />
            <div id="pl-bar"><span></span></div>
            <p id="pl-txt">Chargement…</p>
        </div>
    );
}

export default function Layout({ children, hideNewsletter = false }) {
    // Scroll reveal — se relance à chaque navigation Inertia
    useEffect(() => {
        const runReveal = () => {
            const obs = new IntersectionObserver(entries => {
                entries.forEach(x => {
                    if (x.isIntersecting) x.target.classList.add('visible');
                });
            }, { threshold: 0.08 });
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
            return obs;
        };

        const obs = runReveal();
        const unsubscribe = router.on('navigate', () => {
            obs.disconnect();
            setTimeout(runReveal, 100);
        });

        return () => {
            obs.disconnect();
            unsubscribe();
        };
    }, []);

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
