import AppointmentCalender from "@/components/AppointmentCalender";
import KpiCard from "@/components/KPICard";
import SystemLogs from "@/components/SystemLogs";

export default async function Dashboard() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto bg-background">
      {/* Dashboard Content */}
      <div className="p-8 space-y-8">
        {/* Page Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Hospital Overview</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time performance metrics and department analytics.</p>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Patients */}
          <KpiCard iconType="patient" title="Total Patients" value="1,240" />
          {/* Total Revenue */}
          {/* <KpiCard iconType="revenue" title="Total Revenue" value="$452,190" /> */}
          {/* Doctors Available */}
          <KpiCard iconType="doctor" title="Doctors Available" value="60" />
          {/* Receptionist Available */}
          <KpiCard iconType="receptionist" title="Receptionist Available" value="5" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Trends Chart */}
          <div className="lg:col-span-2 bg-foreground p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Patient Trends</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Male vs Female</p>
              </div>
              <div className="flex items-center gap-4">
                <select className="text-xs font-bold border-none text-black dark:text-white bg-background rounded-lg py-1.5 pl-3 pr-8 focus:ring-0">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[40, 65, 55, 80, 70, 85, 75, 90, 82, 78, 88, 92].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${height}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-4">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Calendar */}
          <AppointmentCalender />
        </div>

        {/* Recent Admissions & System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Admissions */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Recent Admissions</h4>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700">VIEW ALL</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Room No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center font-bold text-xs">RJ</div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Robert Jenkins</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Emergency</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Dr. Emily Stone</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-black rounded uppercase tracking-wider">Critical</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900 dark:text-white">ICU-04</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center font-bold text-xs">MA</div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Maria Alvez</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Orthopedics</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Dr. Marc Suzer</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-xs font-black rounded uppercase tracking-wider">Stable</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900 dark:text-white">302-B</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center font-bold text-xs">KW</div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Kevin Wright</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Neurology</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">Dr. Lisa Ray</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs font-black rounded uppercase tracking-wider">Observing</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900 dark:text-white">415-A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* System Logs */}
          <SystemLogs />
        </div>
      </div>

      {/* Footer */}
      <footer className="p-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
        <p>© 2023 MediCenter Pro HMS. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Support Portal</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
}