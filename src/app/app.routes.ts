import { Routes } from '@angular/router';
import { HomecardComponent } from './homecard/homecard.component';
import { HomeListComponent } from './home-list/home-list.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "homes",
        pathMatch: "full",
      },
      {
        path: "homes",
        component: HomeListComponent,
      },
      {
        path: "card",
        component: HomecardComponent,
      },

];

