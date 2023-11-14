import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRegistroComponent } from './list-registro.component';

describe('ListRegistroComponent', () => {
  let component: ListRegistroComponent;
  let fixture: ComponentFixture<ListRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
