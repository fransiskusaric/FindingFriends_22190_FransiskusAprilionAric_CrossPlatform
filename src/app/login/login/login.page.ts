import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any;
  friends: any = [];
  notfriends: any = [];
  userfriends: any = [];
  // tslint:disable-next-line:variable-name
  validations_form: FormGroup;
  errorMessage = '';
  // tslint:disable-next-line:variable-name
  validation_messages = {
    email: [
      {type: 'required', message: 'Email is required.'},
      {type: 'pattern', message: 'Enter a valid email.'}
    ],
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'pattern', message: 'Password must be at least 6 characters long.'}
    ]
  };

  constructor(
      private authSrv: AuthService,
      private profileSrv: ProfileService,
      private formBuilder: FormBuilder,
      private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    });
  }

  loginUser(value){
    this.authSrv.loginUser(value)
        .then(res => {
          console.log(res);
          this.profileSrv.getAllUser().snapshotChanges().pipe(
              map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
          ).subscribe(data => {
            let j = 0;
            for (let i = 0; i < data.length; i++) {
              if (data[i].id === res.user.uid) {
                this.user = data[i];
              }
            }
            console.log('user', this.user);
            this.profileSrv.setUser(this.user);

            this.profileSrv.getAllFriends().snapshotChanges().pipe(
                map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
            ).subscribe(frnd => {
              let j = 0;
              for (let i = 0; i < frnd.length; i++) {
                if (frnd[i].id === res.user.uid) {
                  this.friends[j] = frnd[i]; j++;
                }
              }
              console.log('friends', this.friends);
              if (!this.friends) {
                let n = 0;
                let m = 0;
                for (let i = 0; i < data.length; i++) {
                  for (let j = 0; j < this.friends.length; j++) {
                    if (data[i].id === this.friends[j].friendid) {
                      this.userfriends[n] = data[i];
                      n++;
                    } else if (data[i].id !== res.user.uid) {
                      this.notfriends[m] = data[i];
                      m++;
                    }
                  }
                }
              } else {
                let m = 0;
                for (let i = 0; i < data.length; i++) {
                  if (data[i].id !== res.user.uid) {
                    this.notfriends[m] = data[i];
                    m++;
                  }
                }
              }
              console.log(this.userfriends, this.notfriends);
              this.profileSrv.setFriends(this.userfriends);
              this.profileSrv.setNotFriends(this.notfriends);
            });
          });
          this.errorMessage = '';
          this.navCtrl.navigateForward('/home');
        }, err => {
          this.errorMessage = err.message;
        });
  }

  goToRegistrationPage() {
    this.navCtrl.navigateForward('/register');
  }
}
