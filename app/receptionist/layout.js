import ReceptionistNav from "@/components/ReceptionistNav"
import ReceptionistSideNav from "@/components/ReceptionistSideNav"

export default async function ReceptionistLayout({ children }) {
    return (
        <div className="layout-head h-screen overflow-hidden flex flex-col">
            <ReceptionistNav />
            <div className="flex h-full overflow-hidden">
                <ReceptionistSideNav />
                {children}
            </div>
        </div>
    )
}