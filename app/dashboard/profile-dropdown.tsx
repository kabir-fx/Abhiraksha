"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  User,
  LogOut,
  Info,
  X,
  Building2,
  FileText,
  Award,
  MapPin,
  BedDouble,
  Mail,
  ChevronDown,
} from "lucide-react";

interface Hospital {
  name: string;
  registrationNumber: string;
  nabhStatus: string;
  state: string;
  bedCapacity: number;
  contactPerson: string;
  billingEmail: string;
}

interface ProfileDropdownProps {
  hospital: Hospital;
}

export default function ProfileDropdown({ hospital }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
            {hospital.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">
            {hospital.name}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowAbout(true);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-gray-400" />
                About Hospital
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="w-full text-left px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                Hospital Profile
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Hospital Name
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    {hospital.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Registration No.
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    {hospital.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    NABH/NABL Status
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50 capitalize flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-600" />
                    {hospital.nabhStatus.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    State
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {hospital.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Bed Capacity
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-gray-400" />
                    {hospital.bedCapacity} beds
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Contact Person
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {hospital.contactPerson}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Billing Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {hospital.billingEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <p className="text-xs text-gray-500 text-center">
                Contact support to update your hospital profile details.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
