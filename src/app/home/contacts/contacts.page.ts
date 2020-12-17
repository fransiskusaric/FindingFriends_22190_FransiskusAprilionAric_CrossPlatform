import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {ProfileService} from '../../services/profile.service';
import {map} from 'rxjs/operators';
import {LoadingController, ToastController} from '@ionic/angular';

const USER_KEY = 'USER';
const FRIENDS_KEY = 'FRIENDS';
const NOTFRIENDS_KEY = 'NOTFRIENDS';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  uid: string;
  friends: any = [];
  notfriends: any = [];
  deleted: any;

  constructor(
      private storage: Storage,
      private profileSrv: ProfileService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.storage.get(USER_KEY).then((val) => {
      this.uid = val.id;
    });
  }

  ionViewWillEnter() {
    this.storage.get(FRIENDS_KEY).then((val) => {
      this.friends = val;
      console.log(this.friends);
    });
    this.storage.get(NOTFRIENDS_KEY).then((val) => {
      this.notfriends = val;
    });
  }

  delete(friendid: string) {
    this.deleted = this.getKey(friendid);
    this.notfriends.push(this.deleted);
    this.profileSrv.setNotFriends(this.notfriends);

    this.profileSrv.getAllFriends().snapshotChanges().pipe(
        map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].friendid === friendid && data[i].id === this.uid) {
          this.profileSrv.deleteFriend(data[i].key).then(() => {
            this.presentLoading().then(() => {
              this.presentToast();
            });
          });
        }
      }
    });

    this.friends = this.friends.filter(friend => {
      return friend.id !== friendid;
    });
    this.profileSrv.setFriends(this.friends);
  }

  getKey(id: string) {
    return {...this.friends.find(friend => {
        return friend.id === id;
      })};
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Successfully deleted.',
      color: 'primary',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Goodbye my friend...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading finished!');
  }
}
