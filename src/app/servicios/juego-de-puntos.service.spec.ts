import { TestBed } from '@angular/core/testing';

import { JuegoDePuntosService } from './juego-de-puntos.service';

describe('JuegoDePuntosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JuegoDePuntosService = TestBed.get(JuegoDePuntosService);
    expect(service).toBeTruthy();
  });
});
