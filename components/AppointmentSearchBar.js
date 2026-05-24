"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AppointmentSearchBar({
  defaultQuery = "",
  placeholder = "Search by patient name, ID, doctor, or department...",
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") || "").trim();
    const params = new URLSearchParams(searchParams.toString());

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-[300px]">
      <div className="relative group">
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          className="w-full pl-10 pr-4 py-2.5 bg-foregd border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-600 transition-all text-sm"
          placeholder={placeholder}
        />
      </div>
    </form>
  );
}
