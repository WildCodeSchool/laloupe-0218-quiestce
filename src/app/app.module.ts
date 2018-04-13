import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { LoginComponent } from './login/login.component';

import { HttpModule } from '@angular/http';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { routes } from './app.routes';


import * as $ from 'jquery';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { GameComponent } from './game/game.component';
import { GamegotComponent } from './gamegot/gamegot.component';
import { MatchmakingotComponent } from './matchmakingot/matchmakingot.component';
import { MatchmakingwcsComponent } from './matchmakingwcs/matchmakingwcs.component';
import { GamewcsComponent } from './gamewcs/gamewcs.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RulesComponent,
    LoginComponent,
    MatchmakingComponent,
    GameComponent,
    GamegotComponent,
    MatchmakingotComponent,
    MatchmakingwcsComponent,
    GamewcsComponent,

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'laloupe-0218-quiestce'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    FormsModule,
    routes,
    NgbModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
