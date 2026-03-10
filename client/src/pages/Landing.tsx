import { Shield, ArrowRight, CheckCircle2, Zap, Globe } from 'lucide-react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/ui/navigation/AppHeader'
import  Footer  from '../components/ui/navigation/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] selection:bg-[rgb(var(--primary)/0.3)]">
      <AppHeader
        collapsed={false}
        onToggleDesktop={() => { }}
        onOpenMobile={() => { }}
      />

      <main className="relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[rgb(var(--primary)/0.15)] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--text)/0.8)] text-xs font-medium mb-8 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="opacity-70">v2.0 is now live:</span>
              <span className="font-bold text-[rgb(var(--primary))]">Ultra-Fast Sync</span>
              <ArrowRight size={14} />
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8">
              Your data, <br />
              <span className="bg-gradient-to-r from-[rgb(var(--primary))] to-blue-400 bg-clip-text text-transparent">
                fortified.
              </span>
            </h1>

            <p className="text-xl text-[rgb(var(--text)/0.6)] max-w-lg leading-relaxed mb-10">
              Experience the next generation of cloud storage.
              Zero-knowledge encryption paired with blazing fast speeds across all your devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-2 bg-[rgb(var(--primary))] text-white px-10 py-5 rounded-2xl font-bold transition-all hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Get 2GB Free</span>
                <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card)/0.5)] backdrop-blur-md text-[rgb(var(--text))] font-bold hover:bg-[rgb(var(--card))] transition-all active:scale-95"
              >
                Explore Demo
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-[rgb(var(--border))] pt-8">
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-sm text-[rgb(var(--text)/0.5)]">Uptime SLA</p>
              </div>
              <div className="w-[1px] h-10 bg-[rgb(var(--border))]" />
              <div>
                <p className="text-2xl font-bold">256-bit</p>
                <p className="text-sm text-[rgb(var(--text)/0.5)]">AES Encryption</p>
              </div>
            </div>
          </div>

          {/* Premium Visual Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary)/0.2)] to-transparent rounded-full blur-3xl scale-150 opacity-20" />

            <div className="relative w-full max-w-md aspect-[4/3] bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <div className="h-2 w-20 bg-[rgb(var(--text)/0.1)] rounded-full" />
                  <div className="h-2 w-12 bg-[rgb(var(--text)/0.05)] rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary)/0.1)] border border-[rgb(var(--primary)/0.2)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[rgb(var(--bg)/0.5)] border border-[rgb(var(--border))] animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary)/0.1)] mb-3" />
                    <div className="h-2 w-full bg-[rgb(var(--text)/0.1)] rounded-full" />
                  </div>
                ))}
              </div>

              {/* Floating Tooltip */}
              <div className="absolute -right-8 top-1/4 p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-[rgb(var(--border))] flex items-center gap-3 animate-bounce shadow-primary/20">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={20} />
                </div>
                <div className="pr-4">
                  <p className="text-xs font-bold">Sync Complete</p>
                  <p className="text-[10px] opacity-50">1.2 GB uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-bold mb-4">Built for power users.</h2>
              <p className="text-[rgb(var(--text)/0.5)] text-lg">Sophisticated tools, simplified for everyone.</p>
            </div>

            <div className="grid md:grid-cols-6 md:grid-rows-2 gap-4 h-full">
              <FeatureCard
                className="md:col-span-3 md:row-span-2"
                icon={<Shield size={32} />}
                title="Privacy is not an option"
                description="Our end-to-end encryption means even we can't see your files. Your data belongs to you, and only you."
              />
              <FeatureCard
                className="md:col-span-3"
                icon={<Zap size={24} />}
                title="Instant Sync"
                description="Proprietary delta-sync technology ensures only changes are uploaded."
              />
              <FeatureCard
                className="md:col-span-3"
                icon={<Globe size={24} />}
                title="Global Edge Nodes"
                description="Access your files at local speeds from anywhere in the world."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="relative rounded-[3rem] overflow-hidden bg-blue-500 px-8 py-20 text-center text-white border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.2),transparent)]" />
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 italic tracking-tight">Secure your digital legacy.</h3>
              <p className="text-zinc-400 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
                Join 10,000+ users who trust SecureCloud with their most important assets.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-black px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl"
              >
                Create Your Vault
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

    </div>
  )
}

const FeatureCard = ({
  icon,
  title,
  description,
  className
}: {
  icon: JSX.Element,
  title: string,
  description: string,
  className?: string
}) => (
  <div className={`group p-8 rounded-[2.5rem] bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:border-[rgb(var(--primary)/0.5)] transition-all duration-500 flex flex-col justify-between overflow-hidden relative ${className}`}>
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700">
      {icon}
    </div>
    <div>
      <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-[rgb(var(--bg))] text-[rgb(var(--primary))] border border-[rgb(var(--border))] group-hover:scale-110 group-hover:bg-[rgb(var(--primary))] group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h4 className="font-black text-2xl text-[rgb(var(--text))] mb-4 leading-tight">{title}</h4>
      <p className="text-[rgb(var(--text)/0.5)] leading-relaxed font-medium">{description}</p>
    </div>
  </div>
)

export default Landing