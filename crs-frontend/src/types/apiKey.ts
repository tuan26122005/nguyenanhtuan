export interface ApiKey {
    id: number;
    name: string;
    key: string;
    scope: string;
    active: boolean;
    expiresAt?: string;
}