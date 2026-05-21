import DoctorNavbar from "@/components/DoctorNavbar"
import DoctorSideNav from "@/components/DoctorSideNav"
export default function DoctorLayout({ children }) {
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <DoctorNavbar />
            <div className="flex h-full overflow-hidden">
                <DoctorSideNav />
                {children}
            </div>
        </div>
    )
}