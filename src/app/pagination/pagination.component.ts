import { Component, computed, inject } from '@angular/core';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  homeService = inject(HomeService);
  currentPage = 1;
  totalPages = this.homeService.totalPages.asReadonly();
  totalHomes = this.homeService.totalHomes.asReadonly();
  pages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  onPageChange(page: number) {
    this.currentPage = page;
    this.homeService.fetchHomes(page);
  }
}
