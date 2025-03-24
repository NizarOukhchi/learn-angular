import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeFilter } from "../models/filter.type";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-filter-homes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./filter-homes.component.html",
  styleUrl: "./filter-homes.component.css",
})
export class FilterHomesComponent {
  homeService = inject(HomeService);

  // Available options
  cities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Denver"];
  roomOptions = [1, 2, 3, 4, 5, 6];
  bathroomOptions = [1, 2, 3, 4, 5];
  poolOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // Filter model
  filter = signal<HomeFilter>({});

  // Track whether the filter has been applied
  isFilterApplied = signal(false);

  applyFilter(): void {
    this.isFilterApplied.set(true);
    this.homeService.setFilter(this.filter());
    this.homeService.fetchHomes(1); // Reset to first page when filter changes
  }

  clearFilter(): void {
    this.filter.set({});
    this.isFilterApplied.set(false);
    this.homeService.setFilter({});
    this.homeService.fetchHomes(1);
  }

  updateFilter(key: keyof HomeFilter, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.update((current) => ({
      ...current,
      [key]: value === "" ? undefined : value,
    }));
  }
}