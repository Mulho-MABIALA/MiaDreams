import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import NewsletterPopup from './NewsletterPopup';

export default function Layout({ children, title, hideNewsletter = false }) {
    const { pathname } = useLocation();

    // Title de la page
    useEffect(() => {
        document.title = title ? `${title} — MIA DREAMS & CO` : 'MIA DREAMS & CO';
    }, [title]);

    // Scroll reveal — robuste pour le contenu async (après fetch API)
    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(x => {
                if (x.isIntersecting) {
                    x.target.classList.add('visible');
                    obs.unobserve(x.target); // libère la mémoire après activation
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

        const observeNew = () => {
            document.querySelectorAll('.reveal:not([data-rev])').forEach(el => {
                el.setAttribute('data-rev', '1');
                obs.observe(el);
            });
        };

        // Observer les éléments déjà présents dans le DOM
        observeNew();

        // Attrape les éléments .reveal ajoutés après les fetch API
        const mutObs = new MutationObserver(observeNew);
        mutObs.observe(document.body, { childList: true, subtree: true });

        return () => {
            obs.disconnect();
            mutObs.disconnect();
            // Remet à zéro data-rev pour la prochaine page
            document.querySelectorAll('[data-rev]').forEach(el => el.removeAttribute('data-rev'));
        };
    }, [pathname]);

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
            {!hideNewsletter && <NewsletterPopup />}
        </>
    );
}
