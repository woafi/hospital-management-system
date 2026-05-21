import AdminSideNav from "@/components/AdminSideNav";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <AdminSideNav />
           {children}
        </div>
    )
}