

const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-[rgb(var(--border))] bg-[rgb(var(--card)/0.3)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="font-bold text-xl italic">SecureCloud.</div>
                <div className="flex gap-8 text-sm text-[rgb(var(--text)/0.5)] font-medium">
                    <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Terms</a>
                    <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">API Documentation</a>
                </div>
                <p className="text-sm text-[rgb(var(--text)/0.4)]">
                    © {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer