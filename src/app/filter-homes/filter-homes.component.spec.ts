import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHomesComponent } from './filter-homes.component';

describe('FilterHomesComponent', () => {
  let component: FilterHomesComponent;
  let fixture: ComponentFixture<FilterHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterHomesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
