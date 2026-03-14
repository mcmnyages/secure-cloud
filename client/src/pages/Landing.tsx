import { Shield, Zap, Globe } from "lucide-react"
import type { JSX } from "react"
import { Link } from "react-router-dom"
import AppHeader from "../components/ui/navigation/AppHeader"
import Footer from "../components/ui/navigation/Footer"

const Landing = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader
        collapsed={false}
        onToggleDesktop={() => {}}
        onOpenMobile={() => {}}
      />

      <main>

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Secure cloud storage <br />
            built for everyday use
          </h1>

          <p className="mt-6 text-lg text-[rgb(var(--text)/0.6)] max-w-xl mx-auto">
            Store, sync and share your files across all your devices.
            Simple, private and fast.
          </p>

          <div className="flex justify-center gap-4 mt-10">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-[rgb(var(--primary))] text-white font-medium hover:opacity-90 transition"
            >
              Get started free
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-[rgb(var(--border))] font-medium hover:bg-[rgb(var(--card))]"
            >
              View demo
            </Link>
          </div>

          <p className="mt-8 text-sm text-[rgb(var(--text)/0.5)]">
            Trusted by 10,000+ users
          </p>
        </section>


        {/* PRODUCT PREVIEW */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-xl border border-[rgb(var(--border))] overflow-hidden shadow-sm">
            <img
              src="/dashboard-preview.png"
              alt="SecureCloud dashboard"
              className="w-full"
            />
          </div>
        </section>


        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">
              Everything you need
            </h2>

            <p className="text-[rgb(var(--text)/0.5)]">
              Powerful features without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Feature
              icon={<Shield size={22} />}
              title="Secure by default"
              description="Your files are protected using industry-standard encryption so only you can access them."
            />

            <Feature
              icon={<Zap size={22} />}
              title="Fast sync"
              description="Files update instantly across your devices with efficient background syncing."
            />

            <Feature
              icon={<Globe size={22} />}
              title="Access anywhere"
              description="Open, upload and manage your files from anywhere in the world."
            />
          </div>
        </section>


        {/* STATS */}
        <section className="border-y border-[rgb(var(--border))] py-16">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 text-center gap-10">
            <Stat number="99.9%" label="Uptime SLA" />
            <Stat number="256-bit" label="AES Encryption" />
            <Stat number="10k+" label="Active Users" />
            <Stat number="1M+" label="Files Stored" />
          </div>
        </section>


        {/* CTA */}
        <section className="text-center py-24 px-6">
          <h2 className="text-3xl font-semibold">
            Start storing your files securely
          </h2>

          <p className="mt-4 text-[rgb(var(--text)/0.6)]">
            Create a free account and get 2GB of storage.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Create free account
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  )
}



type FeatureProps = {
  icon: JSX.Element
  title: string
  description: string
}

const Feature = ({ icon, title, description }: FeatureProps): JSX.Element => {
  return (
    <div className="space-y-4">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--primary))]">
        {icon}
      </div>

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-[rgb(var(--text)/0.6)] leading-relaxed">
        {description}
      </p>
    </div>
  )
}



type StatProps = {
  number: string
  label: string
}

const Stat = ({ number, label }: StatProps): JSX.Element => {
  return (
    <div>
      <p className="text-2xl font-semibold">{number}</p>
      <p className="text-sm text-[rgb(var(--text)/0.5)] mt-1">{label}</p>
    </div>
  )
}



export default Landing
