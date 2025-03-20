import { Routes } from '@angular/router';
import { HomeListComponent } from './home-list/home-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeListComponent,
    }
];
