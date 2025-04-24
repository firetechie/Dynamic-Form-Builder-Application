export enum Role {
    Admin = 'admin',
    User = 'user'
}

export type RoleType = keyof typeof Role; // 'Admin' | 'User'