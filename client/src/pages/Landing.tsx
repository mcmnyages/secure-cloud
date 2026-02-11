import { Shield, Upload, HardDrive, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/navigation/AppHeader'

const Landing = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      {/* The AppHeader now handles all Navigation 
          (Logo, Login, Register, and User Profile)
      */}
      <AppHeader 
        collapsed={false} 
        onToggleDesktop={() => {}} 
        onOpenMobile={() => {}} 
      />

      <main>
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--primary))]"></span>
              </span>
              TRUSTED BY 10K+ USERS
            </div>
            
            <h2 className="text-5xl md:text-6xl font-extrabold text-[rgb(var(--text))] leading-[1.1] tracking-tight">
              Secure cloud storage, <br />
              <span className="text-[rgb(var(--primary))]">made simple.</span>
            </h2>

            <p className="mt-8 text-lg text-[rgb(var(--text)/0.7)] max-w-lg leading-relaxed">
              Upload, manage, and access your files from anywhere. 
              Built with military-grade security and a focus on lightning-fast speed.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[rgb(var(--primary))] text-white px-8 py-4 rounded-xl font-bold hover:bg-[rgb(var(--primary),0.85)] transition-all shadow-lg shadow-[rgb(var(--primary))/0.25] active:scale-95"
              >
                Start for free
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--text)/0.85)] font-semibold hover:bg-[rgb(var(--bg))] transition-all active:scale-95"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-[rgb(var(--text)/0.6)]">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} className="text-green-500" /> No credit card
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} className="text-green-500" /> 2GB free storage
              </div>
            </div>
          </div>

          {/* Visual UI Mockup */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[rgb(var(--primary))/0.05] to-[rgb(var(--primary))/0.1] rounded-[2rem] blur-2xl opacity-50" />
            <div className="relative bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-4 w-32 bg-[rgb(var(--bg)/0.7)] rounded-full" />
              </div>
              
              <div className="space-y-4">
                {[80, 45, 60].map((width, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--primary)/0.1)] flex items-center justify-center text-[rgb(var(--primary))]">
                      <Upload size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-full bg-[rgb(var(--bg)/0.7)] rounded-full overflow-hidden">
                        <div className="h-full bg-[rgb(var(--primary))]" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[rgb(var(--card))] py-24 border-y border-[rgb(var(--border))]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h3 className="text-3xl font-bold text-[rgb(var(--text))]">Everything you need to manage data</h3>
              <p className="text-[rgb(var(--text)/0.6)] mt-4">Powerful features to help you keep your digital life organized and secure.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Feature
                icon={<Upload size={24} />}
                title="Easy uploads"
                description="Drag and drop your files directly into your browser. We handle the rest."
              />
              <Feature
                icon={<Shield size={24} />}
                title="Secure by default"
                description="End-to-end encryption ensures that only you have access to your sensitive files."
              />
              <Feature
                icon={<HardDrive size={24} />}
                title="Storage insights"
                description="Get detailed breakdowns of your storage usage by file type and date."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-[rgb(var(--primary))] rounded-[2rem] px-8 py-16 text-center text-white shadow-2xl shadow-[rgb(var(--primary))/0.15]">
            <h3 className="text-4xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-[rgb(var(--primary)/0.2)] text-lg mb-10 max-w-md mx-auto">
              Create an account today and get 2GB of secure storage for free.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-[rgb(var(--primary))] px-10 py-4 rounded-xl font-bold hover:bg-[rgb(var(--primary)/0.1)] transition-all hover:scale-105"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-[rgb(var(--text)/0.4)] border-t border-[rgb(var(--border))]">
        <p className="text-sm">© {new Date().getFullYear()} SecureCloud. All rights reserved.</p>
      </footer>
    </div>
  )
}

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element
  title: string
  description: string
}) => (
  <div className="group bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-3xl p-8 hover:bg-[rgb(var(--bg))] hover:shadow-xl hover:border-transparent transition-all duration-300">
    <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-[rgb(var(--bg))] text-[rgb(var(--primary))] shadow-sm group-hover:bg-[rgb(var(--primary))] group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="font-bold text-xl text-[rgb(var(--text))]">{title}</h4>
    <p className="mt-3 text-[rgb(var(--text)/0.6)] leading-relaxed">{description}</p>
  </div>
)

export default Landing