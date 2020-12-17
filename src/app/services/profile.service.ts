import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // initialize user
  private dbPathUser = '/user';
  userRef: AngularFireList<User> = null;

  constructor(private db: AngularFireDatabase) {
    this.userRef = db.list(this.dbPathUser);
  }

  createUser(user: User): any {
    console.log(user);
    return this.userRef.push(user);
  }
}
