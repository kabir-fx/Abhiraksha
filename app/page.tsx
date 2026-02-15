import Link from "next/link";
import { ArrowRight, Shield, Zap, BarChart3, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16M8 10V14M16 10V14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              अभिरक्षा
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all duration-200 shadow-sm shadow-brand-600/25 flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full border border-brand-100 mb-6 animate-fade-in">
            <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
            <span className="text-sm font-medium text-brand-700">
              Built for Indian Hospitals
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight animate-fade-in stagger-1">
            Your Hospital&apos;s
            <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
              Insurance Intelligence
            </span>
            <br />
            Layer
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-2">
            Insurance copilot for Indian healthcare administrators.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything your billing team needs
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              अभिरक्षा sits alongside your HMS and handles the complex insurance
              layer — so your team can focus on patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileCheck,
                title: "Smart Claims",
                description:
                  "Auto-structure claims, predict TPA queries, and generate pre-auth forms in minutes.",
                gradient: "from-brand-500 to-brand-600",
              },
              {
                icon: BarChart3,
                title: "Revenue Optimization",
                description:
                  "Identify billing gaps, optimize tariff codes, and maximize your rightful reimbursements.",
                gradient: "from-accent-500 to-accent-600",
              },
              {
                icon: Shield,
                title: "IRDAI Compliance",
                description:
                  "Real-time compliance validation against IRDAI timelines, mandatory fields, and regulations.",
                gradient: "from-brand-700 to-brand-800",
              },
              {
                icon: Zap,
                title: "Multilingual AI",
                description:
                  "Works in Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, and English — built for India.",
                gradient: "from-warning-500 to-danger-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-3xl p-12 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Ready to optimize your hospital&apos;s insurance operations?
              </h2>
              <p className="mt-4 text-brand-200 text-lg max-w-lg mx-auto">
                Join hospitals across India that are already saving hours on
                claim processing every week.
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-medium rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-lg"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16M8 10V14M16 10V14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              अभिरक्षा
            </span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} अभिरक्षा
          </p>
        </div>
      </footer>
    </div>
  );
}
