import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParametroComponent } from './list-parametro.component';

describe('ListParametroComponent', () => {
  let component: ListParametroComponent;
  let fixture: ComponentFixture<ListParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParametroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
