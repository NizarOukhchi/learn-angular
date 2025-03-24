import { Routes } from "@angular/router";
import { HomeListComponent } from "./home-list/home-list.component";
import { HomeFormComponent } from "./home-form/home-form.component";

export const routes: Routes = [
  {
    path: "homes",
    component: HomeListComponent,
  },
  {
    path: "homes/new",
    component: HomeFormComponent,
  },
  {
    path: "homes/:id",
    component: HomeFormComponent,
  },
  {
    path: "",
    redirectTo: "homes",
    pathMatch: "full",
  },
];