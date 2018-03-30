import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

export const router: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'rules', component: RulesComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
