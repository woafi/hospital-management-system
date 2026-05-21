export default async function DoctorProfile() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden bg-background text-gray-900 dark:text-gray-100 font-sans">

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Hero Profile Section */}
        <div className="bg-foreground rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                    AS
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dr. Adrian Stone</h1>
                <p className="text-primary font-semibold text-lg">Senior Cardiologist</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                  <span className="px-3 py-1 bg-foregd dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Department of Cardiology
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Professional Details Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Core Expertise
            </h2>

            {/* Qualification Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Qualifications
              </label>
              <div className="w-full bg-foregd border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3">
                MD, Cardiology, Harvard Medical School; Fellowship in Interventional Cardiology
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Base Consultation Fee ($)
              </label>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="w-full bg-foregd border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3">
                  1500.00
                </div>
              </div>
            </div>

            {/* Professional Bio */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Professional Summary
              </label>
              <div className="w-full bg-foregd border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3">
                Highly experienced cardiologist specializing in minimally invasive cardiac procedures and preventive heart care with over 15 years of clinical practice in major medical centers.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const doctorIds = ["32HDJ3G5", "32HDJ3G4F", "32HDJ3G52"];
  return doctorIds.map((doctorId) => ({
    doctorId,
  }));
}

// export const revalidate = 3600; // Revalidate every hour (ISR)