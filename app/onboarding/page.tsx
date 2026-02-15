"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Award,
  MapPin,
  BedDouble,
  User,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Shield,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman & Nicobar Islands",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Lakshadweep",
];

const NABH_OPTIONS = [
  { value: "nabh_accredited", label: "NABH Accredited" },
  { value: "nabl_accredited", label: "NABL Accredited" },
  { value: "nabh_nabl", label: "NABH + NABL Accredited" },
  { value: "entry_level", label: "NABH Entry Level" },
  { value: "not_accredited", label: "Not Accredited" },
  { value: "in_process", label: "In Process" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [nabhStatus, setNabhStatus] = useState("");
  const [state, setState] = useState("");
  const [bedCapacity, setBedCapacity] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!hospitalName.trim()) {
      setError("Hospital name is required.");
      return;
    }
    if (!registrationNumber.trim()) {
      setError("Facility registration number is required.");
      return;
    }
    if (!nabhStatus) {
      setError("Please select NABH/NABL status.");
      return;
    }
    if (!state) {
      setError("Please select a state.");
      return;
    }
    if (!bedCapacity || parseInt(bedCapacity) < 1) {
      setError("Please enter a valid bed capacity.");
      return;
    }
    if (!contactPerson.trim()) {
      setError("Contact person name is required.");
      return;
    }
    if (!billingEmail.trim()) {
      setError("Billing department email is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hospitalName.trim(),
          registrationNumber: registrationNumber.trim(),
          nabhStatus,
          state,
          bedCapacity: parseInt(bedCapacity),
          contactPerson: contactPerson.trim(),
          billingEmail: billingEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <span className="text-lg font-bold text-gray-900">अभिरक्षा</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-accent-500" />
            Secure Onboarding
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-5 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Set up your hospital profile
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-md mx-auto">
            This helps us tailor अभिरक्षा to your facility&apos;s needs and
            regulatory requirements.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-500/20 rounded-xl text-sm text-danger-600 animate-fade-in">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="hospital-name"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Building2 className="w-4 h-4 text-gray-400" />
                Hospital Name
              </label>
              <input
                id="hospital-name"
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. City General Hospital"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-number"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                Facility Registration Number
              </label>
              <input
                id="reg-number"
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. MH/REG/2024/001234"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-400">
                Your hospital&apos;s registration number as issued by state
                authorities.
              </p>
            </div>

            {/* NABH/NABL Status + State — two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* NABH/NABL Status */}
              <div className="space-y-1.5">
                <label
                  htmlFor="nabh-status"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Award className="w-4 h-4 text-gray-400" />
                  NABH/NABL Status
                </label>
                <select
                  id="nabh-status"
                  required
                  value={nabhStatus}
                  onChange={(e) => setNabhStatus(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {NABH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label
                  htmlFor="state"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  State
                </label>
                <select
                  id="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bed Capacity + Contact Person — two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bed Capacity */}
              <div className="space-y-1.5">
                <label
                  htmlFor="bed-capacity"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <BedDouble className="w-4 h-4 text-gray-400" />
                  Bed Capacity
                </label>
                <input
                  id="bed-capacity"
                  type="number"
                  required
                  min="1"
                  max="10000"
                  value={bedCapacity}
                  onChange={(e) => setBedCapacity(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-person"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Contact Person
                </label>
                <input
                  id="contact-person"
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Full name"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Billing Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="billing-email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                Billing Department Email
              </label>
              <input
                id="billing-email"
                type="email"
                required
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="billing@yourhospital.com"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-400">
                Insurance-related communications will be sent to this email.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-6">
              {/* Info box */}
              <div className="flex items-start gap-3 p-4 bg-brand-50/50 rounded-xl mb-6">
                <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">
                    What happens next?
                  </p>
                  <p>
                    After creating your profile, you&apos;ll be taken to your
                    dashboard where you can start processing claims, setting up
                    integrations, and configuring your insurance workflows.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-brand-600/25 hover:shadow-md hover:shadow-brand-600/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Your data is encrypted and stored securely. By proceeding, you agree
          to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
