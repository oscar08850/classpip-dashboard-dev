import { TestBed } from '@angular/core/testing';

import { JuegoDeColeccionService } from './juego-de-coleccion.service';

describe('JuegoDeColeccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JuegoDeColeccionService = TestBed.get(JuegoDeColeccionService);
    expect(service).toBeTruthy();
  });
});
