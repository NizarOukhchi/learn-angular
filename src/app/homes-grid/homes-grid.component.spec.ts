import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesGridComponent } from './homes-grid.component';

describe('HomesGridComponent', () => {
  let component: HomesGridComponent;
  let fixture: ComponentFixture<HomesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
