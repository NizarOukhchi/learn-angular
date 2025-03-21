import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCardComponent } from '../home-card/home-card.component';
import { PaginationComponent } from "../pagination/pagination.component";
import { HomeService } from "../services/home.service";
import { SortHomesComponent } from '../sort-homes/sort-homes.component';
import { SortState } from '../models/sort.type';

@Component({
  selector: 'app-homes-grid',
  standalone: true,
  imports: [CommonModule, HomeCardComponent, PaginationComponent, SortHomesComponent],
  templateUrl: './homes-grid.component.html',
  styleUrl: './homes-grid.component.css'
})
export class HomesGridComponent {
  homeService = inject(HomeService);
  homes = this.homeService.paginatedHomes;
  isLoading = this.homeService.isLoading;
  error = this.homeService.error;

  ngOnInit(): void {
    this.homeService.fetchHomes();
  }

  onSortChange(sortState: SortState) {
    this.homeService.updateSort(sortState);
  }

  onToggleFavorite(homeId: number) {
    this.homeService.toggleFavorite(homeId);
  }
}
