import { User } from './user';

enum roles {'full-access', 'read-only'};

export class Permission {
    _id: string;
    User: string;
    Role: roles;
    Project: string;
    Date: Date;
}
