import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { MatchmakingotComponent } from './matchmakingot/matchmakingot.component';
import { MatchmakingwcsComponent } from './matchmakingwcs/matchmakingwcs.component';
import { GameComponent } from './game/game.component';
import { GamegotComponent } from './gamegot/gamegot.component';
import { GamewcsComponent } from './gamewcs/gamewcs.component';


import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

export const router: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'rules', component: RulesComponent },
    { path: 'matchmaking', component: MatchmakingComponent },
    { path: 'matchmakingot', component: MatchmakingotComponent },
    { path: 'matchmakingwcs', component: MatchmakingwcsComponent },
    { path: 'game/:id/:username', component: GameComponent },
    { path: 'gamegot/:id/:username', component: GamegotComponent },
    { path: 'gamewcs/:id/:username', component: GamewcsComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
