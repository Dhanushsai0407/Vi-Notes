export interface User {
    id: string;
    email: string;
}

export class AuthService {
    private static USERS_KEY = 'vi_notes_users';
    private static CURRENT_USER_KEY = 'vi_notes_current_user';

    static getUsers(): Record<string, string> {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : {};
    }

    static register(email: string, password: string): User {
        const users = this.getUsers();
        if (users[email]) {
            throw new Error('User already exists. Please log in.');
        }

        // Extremely simple simulation: store cleartext password for demo purposes only
        users[email] = password;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return this.login(email, password);
    }

    static login(email: string, password: string): User {
        const users = this.getUsers();
        if (!users[email]) {
            throw new Error('User not found. Please sign up.');
        }
        if (users[email] !== password) {
            throw new Error('Incorrect password.');
        }

        const user = { id: email, email };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    }

    static logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    static getCurrentUser(): User | null {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }
}
