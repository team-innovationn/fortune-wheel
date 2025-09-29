export type Role = 'admin' | 'auditor';

export type AppUser = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

export const USERS: AppUser[] = [
    { id: 'u-admin-001', name: 'Admin User', email: 'admin@bank.local', role: 'admin' },
    { id: 'u-aud-001', name: 'Audit User', email: 'auditor@bank.local', role: 'auditor' },
];

export const ROLE_PERMS = {
    admin: {
        canUpload: true,
        canDraw: true,
        canViewLogs: true,
        canDownloadWinners: true,
        canDownloadReports: true,
    },
    auditor: {
        canUpload: false,
        canDraw: false,
        canViewLogs: true,
        canDownloadWinners: true,
        canDownloadReports: true,
    },
} as const;

export const getUserByEmail = (email: string | null | undefined): AppUser | null => {
    if (!email) return null;
    return USERS.find(u => u.email === email) ?? null;
};

export const getPermsForRole = (role: Role) => ROLE_PERMS[role];


