import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
    return (
        <Layout title="Page introuvable">
            <div className="min-h-[70vh] bg-[#080808] flex items-center justify-center px-6">
                <div className="text-center reveal">
                    <span className="font-lastica text-[80px] lg:text-[120px] text-gold/10 leading-none block">404</span>
                    <div className="w-10 h-px bg-gold/30 mx-auto my-6" />
                    <h1 className="font-glacial text-sm text-white uppercase tracking-[4px] mb-3">Page introuvable</h1>
                    <p className="font-glacial text-xs text-white/30 tracking-[1px] mb-10">La page que vous recherchez n'existe pas ou a été déplacée.</p>
                    <Link to="/" className="btn btn-gold">RETOUR À L'ACCUEIL</Link>
                </div>
            </div>
        </Layout>
    );
}
