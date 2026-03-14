import { Injectable, signal } from '@angular/core';
import { Medico } from '../models/medico.modelo';

@Injectable({ providedIn: 'root' })
export class MedicoServicio {
  private _medicos = signal<Medico[]>([
    { id: 1, nombres: 'Carlos Alberto', apellidos: 'Mendoza Torres', cedula: '1712345678', especialidad: 'Cardiología', email: 'c.mendoza@graeco.med', telefono: '0991234567', consultorio: '101', registroMedico: 'MSP-2015-001', universidad: 'Universidad Central del Ecuador', anoGraduacion: 2010, estado: 'activo', fechaIngreso: '2020-03-15' },
    { id: 2, nombres: 'María Fernanda', apellidos: 'Rodríguez Vega', cedula: '1798765432', especialidad: 'Neurología', email: 'm.rodriguez@graeco.med', telefono: '0987654321', consultorio: '102', registroMedico: 'MSP-2016-042', universidad: 'PUCE', anoGraduacion: 2012, estado: 'activo', fechaIngreso: '2021-01-10' },
    { id: 3, nombres: 'Jorge Luis', apellidos: 'Paredes Castillo', cedula: '1756789012', especialidad: 'Ginecología', email: 'j.paredes@graeco.med', telefono: '0976543210', consultorio: '103', registroMedico: 'MSP-2014-018', universidad: 'Universidad de Cuenca', anoGraduacion: 2009, estado: 'activo', fechaIngreso: '2019-08-20' },
  ]);

  readonly medicos = this._medicos.asReadonly();

  obtenerTodos(): Medico[] {
    return this._medicos();
  }

  obtenerPorId(id: number): Medico | undefined {
    return this._medicos().find(m => m.id === id);
  }

  obtenerActivos(): Medico[] {
    return this._medicos().filter(m => m.estado === 'activo');
  }

  agregar(medico: Omit<Medico, 'id'>): Medico {
    const nuevo = { ...medico, id: Date.now() } as Medico;
    this._medicos.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizar(id: number, cambios: Partial<Medico>): void {
    this._medicos.update(lista =>
      lista.map(m => m.id === id ? { ...m, ...cambios } : m)
    );
  }

  eliminar(id: number): void {
    this._medicos.update(lista => lista.filter(m => m.id !== id));
  }
}
