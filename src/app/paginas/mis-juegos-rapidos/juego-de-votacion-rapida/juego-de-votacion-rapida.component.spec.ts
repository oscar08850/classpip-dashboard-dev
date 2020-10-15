import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionRapidaComponent } from './juego-de-votacion-rapida.component';

describe('JuegoDeVotacionRapidaComponent', () => {
  let component: JuegoDeVotacionRapidaComponent;
  let fixture: ComponentFixture<JuegoDeVotacionRapidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionRapidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
