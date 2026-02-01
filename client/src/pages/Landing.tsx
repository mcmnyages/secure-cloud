import { Shield, Upload, HardDrive, ArrowRight } from 'lucide-react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          My Secure Cloud
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Secure cloud storage,
            <br />
            <span className="text-blue-600">made simple</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Upload, manage, and access your files from anywhere.
            Built with security, speed, and simplicity in mind.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Visual placeholder */}
        <div className="hidden md:flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 border">
            <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            icon={<Upload size={24} />}
            title="Easy uploads"
            description="Upload your files in seconds with a clean and intuitive interface."
          />
          <Feature
            icon={<Shield size={24} />}
            title="Secure by default"
            description="Your files are protected with modern security best practices."
          />
          <Feature
            icon={<HardDrive size={24} />}
            title="Storage insights"
            description="Track your usage and manage your storage efficiently."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <h3 className="text-3xl font-bold">
            Ready to get started?
          </h3>
          <p className="mt-3 text-blue-100">
            Create an account and start uploading today.
          </p>

          <Link
            to="/register"
            className="inline-block mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} My Secure Cloud. All rights reserved.
      </footer>
    </div>
  )
}

export default Landing

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element
  title: string
  description: string
}) => (
  <div className="bg-white border rounded-2xl p-6 text-center shadow-sm">
    <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
      {icon}
    </div>
    <h4 className="font-semibold text-lg">{title}</h4>
    <p className="mt-2 text-gray-600 text-sm">{description}</p>
  </div>
)
