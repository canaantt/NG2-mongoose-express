import { User } from './user';

enum roles {'admin', 'read-write', 'read-only'};

export class Permission {
    _id: string;
    User: string;
    Role: roles;
    Project: string;
    Date: Date;
}
