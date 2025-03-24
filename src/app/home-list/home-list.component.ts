import { Component } from '@angular/core';
import { HomeGridComponent } from '../home-grid/home-grid.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FavouriteHomeComponent } from '../favourite-home/favourite-home.component';
@Component({
  selector: 'app-home-list',
  imports: [HomeGridComponent, PaginationComponent, FavouriteHomeComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.css',
})
export class HomeListComponent {}
