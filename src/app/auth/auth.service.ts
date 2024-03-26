import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly afAuth = inject(Auth);
  currentUser: User | null = null;
  constructor() {
    this.getAuthState().subscribe((user: User | null) => {
      this.currentUser = user;
    })
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }

  getAuthState() {
    return authState(this.afAuth);
  }

}
