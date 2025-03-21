import { Component, inject } from '@angular/core';
import { HomeService } from '../services/home.service';
import { HomeCardComponent } from '../home-card/home-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
@Component({
  selector: 'app-homes-grid',
  imports: [HomeCardComponent, PaginationComponent],
  templateUrl: './homes-grid.component.html',
  styleUrl: './homes-grid.component.css',
})
export class HomesGridComponent {
  homeService = inject(HomeService);
  homes = this.homeService.paginatedHomes;
  isLoading = this.homeService.isLoading;
  error = this.homeService.error;

  ngOnInit(): void {
    this.homeService.fetchHomes();
  }
}
