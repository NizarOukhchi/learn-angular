import { Routes } from '@angular/router';
import { HomeListComponent } from './components/home-list/home-list.component';

export const routes: Routes = [
    {
        path: "homes",
        component: HomeListComponent,
    },
    {
        path: "",
        redirectTo: "homes",
        pathMatch: "full",
      },
];