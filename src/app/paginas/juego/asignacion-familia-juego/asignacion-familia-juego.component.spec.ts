import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionFamiliaJuegoComponent } from './asignacion-familia-juego.component';

describe('AsignacionFamiliaJuegoComponent', () => {
  let component: AsignacionFamiliaJuegoComponent;
  let fixture: ComponentFixture<AsignacionFamiliaJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionFamiliaJuegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionFamiliaJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
