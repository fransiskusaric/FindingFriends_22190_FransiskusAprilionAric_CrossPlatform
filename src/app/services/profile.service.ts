import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../model/user.model';
import { Storage } from '@ionic/storage';

const USER_KEY = 'USER';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // initialize user
  private dbPathUser = '/user';
  userRef: AngularFireList<User> = null;

  constructor(
      private db: AngularFireDatabase,
      private storage: Storage
  ) {
    this.userRef = db.list(this.dbPathUser);
  }

  createUser(user: User): any {
    console.log(user);
    return this.userRef.push(user);
  }

  getAllUser(): AngularFireList<User> {
    return this.userRef;
  }

  updateUser(key: string, value: any): Promise<void> {
    return this.userRef.update(key, value);
  }

  setUser(user: User) {
    this.storage.set(USER_KEY, user);
  }
}
