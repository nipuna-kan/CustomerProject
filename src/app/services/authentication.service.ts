import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';

const API_URL = 'https://trade-api.shamshi.in';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser = this.currentUserSubject
        .asObservable()
        .pipe(distinctUntilChanged());

    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
        private readonly router: Router
    ) { }

    login(credentials: {
        username: string;
        password: string;
    }): Observable<{ user: User }> {
        console.log(credentials, "cred")
        return this.http.post<any>(`${API_URL}/api/auth/login`,  {username: credentials.username,password : credentials.password})
            .pipe(tap(({ user }) => this.setAuth(user)));
    }

    register(credentials: {
        username: string;
        email: string;
        password: string;
    }): Observable<{ user: User }> {
        return this.http
            .post<{ user: User }>("/users", { user: credentials })
            .pipe(tap(({ user }) => this.setAuth(user)));
    }

    logout(): void {
        this.purgeAuth();
        void this.router.navigate(["/"]);
    }

    getCurrentUser(): Observable<{ user: User }> {
        return this.http.get<{ user: User }>("/user").pipe(
            tap({
                next: ({ user }) => this.setAuth(user),
                error: () => this.purgeAuth(),
            }),
            shareReplay(1)
        );
    }
    public get userValue(): User | null{
        return this.currentUserSubject.value;
    }
    update(user: Partial<User>): Observable<{ user: User }> {
        return this.http.put<{ user: User }>("/user", { user }).pipe(
            tap(({ user }) => {
                this.currentUserSubject.next(user);
            })
        );
    }

    setAuth(user: User): void {
        this.jwtService.saveToken(user.token);
        this.currentUserSubject.next(user);
    }

    purgeAuth(): void {
        this.jwtService.destroyToken();
        this.currentUserSubject.next(null);
    }
}