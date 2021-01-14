import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisJuegosRapidosComponent } from './mis-juegos-rapidos.component';

describe('MisJuegosRapidosComponent', () => {
  let component: MisJuegosRapidosComponent;
  let fixture: ComponentFixture<MisJuegosRapidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisJuegosRapidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisJuegosRapidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
