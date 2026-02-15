import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileDropdown from "./profile-dropdown";
import DashboardContent from "./dashboard-content";
import { FileText } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const hospital = await prisma.hospital.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!hospital) {
    redirect("/onboarding");
  }

  const uploadSections = [
    {
      id: "insurance",
      title: "Insurance Policy",
      description: "Upload the patient's policy card number.",
      iconName: "ShieldCheck" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBorder: "hover:border-blue-200",
      documentType: "insurance" as const,
      mode: "lookup" as const,
    },
    {
      id: "discharge",
      title: "Discharge Summary",
      description: "Upload the detailed clinical discharge summary.",
      iconName: "Activity" as const,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBorder: "hover:border-emerald-200",
      documentType: "discharge" as const,
    },
    {
      id: "bill",
      title: "Hospital Bill",
      description: "Upload the final itemized hospital bill.",
      iconName: "Receipt" as const,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBorder: "hover:border-purple-200",
      documentType: "bill" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/20">
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
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              अभिरक्षा
            </span>
          </div>
          <ProfileDropdown hospital={hospital} />
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            New Claim Request
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Upload the required documents to initiate the AI-powered claims
            processing workflow.
          </p>
        </div>

        <DashboardContent sections={uploadSections} />

        {/* Recent Claims Placeholder */}
        <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Recent Claims
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p>No claims processed yet</p>
              <p className="text-sm mt-1 text-gray-400/80">
                Upload documents above to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
