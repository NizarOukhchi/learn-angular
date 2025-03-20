import { Component } from '@angular/core';

import { HomesGridComponent } from '../homes-grid/homes-grid.component';
import { FavoriteHomesComponent } from '../favorite-homes/favorite-homes.component';

@Component({
  selector: 'app-home-list',
  imports: [HomesGridComponent, FavoriteHomesComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.css',
})
export class HomeListComponent {}
