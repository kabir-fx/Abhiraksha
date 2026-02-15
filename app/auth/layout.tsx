import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "अभिरक्षा — Sign Up",
  description:
    "Create your अभिरक्षा account to streamline hospital insurance operations.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900" />

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-12 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-brand-400/10 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
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
              <span className="text-xl font-bold tracking-tight">अभिरक्षा</span>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Your Hospital&apos;s
              <br />
              <span className="text-brand-200">Insurance Intelligence</span>
              <br />
              Layer
            </h1>
            <p className="text-lg text-brand-200/80 max-w-md leading-relaxed">
              Insurance copilot for Indian healthcare administrators.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {["Claim Automation", "Plugin for HMS", "IRDAI Compliance"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
                  >
                    {feature}
                  </span>
                ),
              )}
            </div>
          </div>

          <p className="text-sm text-brand-300/60">
            © {new Date().getFullYear()} अभिरक्षा
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
