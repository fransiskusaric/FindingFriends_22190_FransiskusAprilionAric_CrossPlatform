import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavController, Platform} from '@ionic/angular';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
// import {Base64} from '@ionic-native/base64/ngx';
import { Camera, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../model/user.model';
import { Storage } from '@ionic/storage';

const USER_KEY = 'USER';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  key: string;
  id: string;
  name: string;
  nim: string;
  picture: string;
  lat: number;
  lng: number;
  profile: User;

  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  constructor(
      private authSrv: AuthService,
      public afAuth: AngularFireAuth,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      // private base64: Base64,
      private profileSrv: ProfileService,
      private navCtrl: NavController,
      private storage: Storage
  ) { }

  async ngOnInit() {
    this.storage.get(USER_KEY).then((val) => {
      this.key = val.key;
      this.id = val.id;
      this.name = val.name;
      this.nim = val.nim;
      this.picture = val.picture;
      this.lat = val.lat;
      this.lng = val.lng;
    });

    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')){
      this.isDesktop = true;
    }
  }

  async getPicture(type: string) {
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    // this.base64.encodeFile(image.dataUrl).then((base64File: string) => {
    //   this.photo = this.sanitizer.bypassSecurityTrustUrl(base64File);
    // });
    console.log(this.photo);
    this.profile = {
      id: this.id,
      name: this.name,
      nim: this.nim,
      picture: this.photo.toString(),
      lat: this.lat,
      lng: this.lng
    };
    this.profileSrv.updateUser(this.key, this.profile);
  }

  logout() {
    this.authSrv.logoutUser().then(() => {
      this.navCtrl.navigateBack('/login');
      this.profileSrv.setUser(null);
      this.profileSrv.setFriends(null);
      this.profileSrv.setNotFriends(null);
    });
  }
}
