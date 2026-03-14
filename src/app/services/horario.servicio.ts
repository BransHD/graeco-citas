import { Injectable, signal } from '@angular/core';
import { Horario } from '../models/horario.modelo';

@Injectable({ providedIn: 'root' })
export class HorarioServicio {
  private _horarios = signal<Horario[]>([
    { id: 1, medicoId: 1, consultorio: '101', diaSemana: 'lunes', horaInicio: '08:00', horaFin: '12:00', intervaloMinutos: 30, cupoMaximo: 8, estado: 'activo' },
    { id: 2, medicoId: 1, consultorio: '101', diaSemana: 'miercoles', horaInicio: '08:00', horaFin: '12:00', intervaloMinutos: 30, cupoMaximo: 8, estado: 'activo' },
    { id: 3, medicoId: 1, consultorio: '101', diaSemana: 'viernes', horaInicio: '14:00', horaFin: '18:00', intervaloMinutos: 30, cupoMaximo: 8, estado: 'activo' },
    { id: 4, medicoId: 2, consultorio: '102', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '13:00', intervaloMinutos: 45, cupoMaximo: 5, estado: 'activo' },
    { id: 5, medicoId: 2, consultorio: '102', diaSemana: 'martes', horaInicio: '14:00', horaFin: '18:00', intervaloMinutos: 45, cupoMaximo: 5, estado: 'activo' },
  ]);

  readonly horarios = this._horarios.asReadonly();

  obtenerTodos(): Horario[] {
    return this._horarios();
  }

  obtenerPorId(id: number): Horario | undefined {
    return this._horarios().find(h => h.id === id);
  }

  obtenerPorMedico(medicoId: number): Horario[] {
    return this._horarios().filter(h => h.medicoId === medicoId);
  }

  agregar(horario: Omit<Horario, 'id'>): Horario {
    const nuevo: Horario = { ...horario, id: Date.now() };
    this._horarios.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizar(id: number, cambios: Partial<Horario>): void {
    this._horarios.update(lista =>
      lista.map(h => h.id === id ? { ...h, ...cambios } : h)
    );
  }

  eliminar(id: number): void {
    this._horarios.update(lista => lista.filter(h => h.id !== id));
  }
}
