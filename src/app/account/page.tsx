"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore, useIsAuthenticated, useUser } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

const accountLinks = [
  {
    title: "Orders",
    description: "View your order history and track shipments",
    href: "/account/orders",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Addresses",
    description: "Manage your billing and shipping addresses",
    href: "/account/addresses",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Wishlist",
    description: "View and manage your saved items",
    href: "/account/wishlist",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
    color: "text-red-600 bg-red-50",
  },
  {
    title: "Account Details",
    description: "Update your name, email, and password",
    href: "/account/details",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
    color: "text-purple-600 bg-purple-50",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg mb-12"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-8  lg:py-12">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-light">
                Welcome back, {user?.displayName || user?.firstName || "there"}!
              </h1>
              <p className="mt-2 text-gray-300">
                Manage your account, track orders, and update preferences.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wishlist Items</p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-semibold mt-1">2026</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Account Dashboard</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
              >
                <div
                  className={`h-12 w-12 rounded-lg ${link.color} flex items-center justify-center mb-4`}
                >
                  {link.icon}
                </div>
                <h2 className="font-semibold text-gray-900 group-hover:text-black">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600">
                  {link.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-700 group-hover:text-black">
                  <span>View</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Account Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <Link
                  href="/account/details"
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {user?.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Need Help?</h2>
            <div className="space-y-4">
              <Link
                href="/customer-service"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.422-2.87-3.183-2.87-1.621 0-2.916 1.129-3.183 2.87v.008a2.126 2.126 0 00-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334a48.455 48.455 0 00-9.345 0"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium group-hover:text-black">
                    Customer Service
                  </p>
                  <p className="text-sm text-gray-500">Get support</p>
                </div>
              </Link>

              <Link
                href="/faq"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mr-4">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium group-hover:text-black">FAQs</p>
                  <p className="text-sm text-gray-500">Common questions</p>
                </div>
              </Link>

              <Link
                href="/size-guide"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mr-4">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium group-hover:text-black">
                    Size Guide
                  </p>
                  <p className="text-sm text-gray-500">Find your fit</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
