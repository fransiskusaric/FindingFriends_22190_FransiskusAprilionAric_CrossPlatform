import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ProfileService} from '../../../services/profile.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Storage} from '@ionic/storage';
import {Friends} from '../../../model/friends.model';
import {map} from 'rxjs/operators';
import {LoadingController, ToastController} from '@ionic/angular';

const USER_KEY = 'USER';
const NOTFRIENDS_KEY = 'NOTFRIENDS';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  uid: string;
  notfriends: any = [];
  friends: any = [];
  userfriend: any = [];
  temp: any;
  friend: Friends;

  constructor(
      private authSrv: AuthService,
      private afAuth: AngularFireAuth,
      private storage: Storage,
      private profileSrv: ProfileService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.storage.get(NOTFRIENDS_KEY).then((val) => {
      this.notfriends = val;
      console.log(this.notfriends);
    });
    this.storage.get(USER_KEY).then((val) => {
      this.uid = val.id;
    });
  }

  add(friendid: string) {
    this.temp = this.getKey(friendid);
    this.friend = {
      id: this.uid,
      friendid: this.temp.id,
      lat: this.temp.lat,
      lng: this.temp.lng
    };
    this.profileSrv.addFriend(this.temp.key, this.friend).then(() => {
      this.presentLoading().then(() => {
        this.presentToast();
      });
    });
    this.notfriends = this.notfriends.filter(friend => {
      return friend.id !== friendid;
    });
    this.profileSrv.setNotFriends(this.notfriends);
  }

  getKey(id: string) {
    return {...this.notfriends.find(friend => {
      return friend.id === id;
      })};
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Successfully added.',
      color: 'primary',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Hello new friend...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading finished!');
  }

  ionViewWillLeave() {
    this.profileSrv.getAllFriends().snapshotChanges().pipe(
        map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe(data => {
      let j = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === this.uid) {
          this.friends[j] = data[i]; j++;
        }
      }
      console.log(this.friends);
      this.profileSrv.getAllUser().snapshotChanges().pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(user => {
        let k = 0;
        for (let i = 0; i < user.length; i++) {
          for (let j = 0; j < this.friends.length; j++) {
            if (user[i].id === this.friends[j].friendid) {
              this.userfriend[k] = user[i]; k++;
            }
          }
        }
        this.profileSrv.setFriends(this.userfriend);
      });
    });
  }
}
