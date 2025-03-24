import { Component } from "@angular/core";

import { FavoriteHomesComponent } from "../favorite-homes/favorite-homes.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { FilterHomesComponent } from "../filter-homes/filter-homes.component";
import { HomeGridComponent } from "../homes-grid/homes-grid.component";


@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [HomeGridComponent, FavoriteHomesComponent, PaginationComponent, FilterHomesComponent, HomeGridComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent {}