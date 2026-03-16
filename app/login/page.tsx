export const metadata = {
  title: 'Login / Signup - TerraSentinel',
}

export default function LoginPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Login</span> / Signup
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Access your TerraSentinel dashboard (UI only).
          </p>
        </header>

        <div className="max-w-md glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 focus:border-cyan-accent/50 outline-none text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 focus:border-cyan-accent/50 outline-none text-white placeholder:text-white/40"
              />
            </div>
            <button
              type="button"
              className="w-full py-3 text-sm font-semibold glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-sm text-white/70">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-cyan-accent hover:text-white transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

