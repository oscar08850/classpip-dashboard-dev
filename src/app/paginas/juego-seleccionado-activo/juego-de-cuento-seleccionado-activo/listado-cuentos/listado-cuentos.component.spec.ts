import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCuentosComponent } from './listado-cuentos.component';

describe('ListadoCuentosComponent', () => {
  let component: ListadoCuentosComponent;
  let fixture: ComponentFixture<ListadoCuentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCuentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
