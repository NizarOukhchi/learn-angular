import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortDirection, SortOption, SortState } from '../models/sort.type';
import { Home } from '../models/home.type';

@Component({
  selector: 'app-sort-homes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-4">
      <select 
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        (change)="onSortFieldChange($event)"
        [value]="currentSort.field">
        <option value="">Trier par...</option>
        @for(option of sortOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      
      <button 
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        (click)="toggleDirection()">
        @if(currentSort.direction === 'asc') {
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
            Ascendant
          </span>
        } @else {
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            Descendant
          </span>
        }
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SortHomesComponent {
  @Output() sortChange = new EventEmitter<SortState>();

  sortOptions: SortOption[] = [
    { label: 'Ville', value: 'city' },
    { label: 'Chambres', value: 'rooms' },
    { label: 'Salles de bain', value: 'bathrooms' },
    { label: 'Titre', value: 'title' }
  ];

  currentSort: SortState = {
    field: 'city',
    direction: 'asc'
  };

  onSortFieldChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    // Si une valeur est sélectionnée, mettre à jour le tri
    if (value) {
      this.currentSort = {
        ...this.currentSort,
        field: value as keyof Home
      };
      console.log('Nouveau tri:', this.currentSort);
      this.emitSortChange();
    }
  }

  toggleDirection() {
    this.currentSort = {
      ...this.currentSort,
      direction: this.currentSort.direction === 'asc' ? 'desc' : 'asc'
    };
    console.log('Direction changée:', this.currentSort);
    this.emitSortChange();
  }

  private emitSortChange() {
    this.sortChange.emit(this.currentSort);
  }
} 