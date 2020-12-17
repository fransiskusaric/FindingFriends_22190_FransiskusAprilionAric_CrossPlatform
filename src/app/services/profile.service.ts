import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../model/user.model';
import { Storage } from '@ionic/storage';
import { Friends } from '../model/friends.model';

const USER_KEY = 'USER';
const FRIENDS_KEY = 'FRIENDS';
const NOTFRIENDS_KEY = 'NOTFRIENDS';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  key: any;
  // initialize user
  private dbPathUser = '/user';
  userRef: AngularFireList<User> = null;
  private dbPathFriends = '/friends';
  friendsRef: AngularFireList<Friends> = null;

  constructor(
      private db: AngularFireDatabase,
      private storage: Storage
  ) {
    this.userRef = db.list(this.dbPathUser);
    this.friendsRef = db.list(this.dbPathFriends);
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

  getAllFriends(): AngularFireList<Friends> {
    return this.friendsRef;
  }

  addFriend(key: any, friend: Friends) {
    this.key = key;
    console.log(friend);
    return this.friendsRef.push(friend);
  }

  deleteFriend(key: string): Promise<void> {
    return this.friendsRef.remove(key);
  }

  setUser(user: User) {
    this.storage.set(USER_KEY, user);
  }

  setFriends(friends: any) {
    this.storage.set(FRIENDS_KEY, friends);
  }

  setNotFriends(notfriends: any) {
    this.storage.set(NOTFRIENDS_KEY, notfriends);
  }
}
