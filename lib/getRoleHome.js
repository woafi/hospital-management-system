export function getRoleHome(payload) {
    const ROLE_HOME = {
        SUPER_ADMIN: () => "/dashboard",
        ADMIN: () => "/dashboard",
        DOCTOR: (p) => `/doctor/${p.id ?? p.userid}/dashboard`,
        RECEPTIONIST: (p) => `/receptionist/${p.id ?? p.userid}/dashboard`,
    };

    return ROLE_HOME[payload.role]
        ? ROLE_HOME[payload.role](payload)
        : '/';
}