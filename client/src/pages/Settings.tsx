import { User, HardDrive, Shield } from 'lucide-react'

const Settings = () => {
  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} />
          <h2 className="font-semibold text-lg">Profile</h2>
        </div>

        <div className="space-y-2 text-gray-600">
          <p>Name: <span className="font-medium">John Doe</span></p>
          <p>Email: <span className="font-medium">john@example.com</span></p>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Profile editing coming soon.
        </p>
      </section>

      {/* Storage */}
      <section className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <HardDrive size={20} />
          <h2 className="font-semibold text-lg">Storage</h2>
        </div>

        <p className="text-gray-600">
          Storage plan: <strong>Free (100 MB)</strong>
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Upgrade options coming soon.
        </p>
      </section>

      {/* Security */}
      <section className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} />
          <h2 className="font-semibold text-lg">Security</h2>
        </div>

        <p className="text-gray-600">
          Password: ********
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Password reset and 2FA coming soon.
        </p>
      </section>
    </div>
  )
}

export default Settings
