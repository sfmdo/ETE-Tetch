import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Repair {
  id: string;
  status: string;
  statusColorClass: string;
  deviceName: string;
  description: string;
  completedDate?: string;
}

@Component({
  selector: 'app-dashbord',
  imports: [CommonModule],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.css',
})
export class Dashbord implements OnInit {
  userName: string = '';

  allRepairs: Repair[] = [
    {
      id: 'ORD-8821A',
      status: 'EN PROCESO',
      statusColorClass: 'bg-amber-400',
      deviceName: 'MacBook Pro 16" (M1 Max)',
      description: 'Diagnóstico completado. En espera de piezas para reemplazo de placa lógica.',
    },
    {
      id: 'ORD-8794C',
      status: 'COMPLETADO',
      statusColorClass: 'bg-green-500',
      deviceName: 'Dell XPS 15 9500',
      description: 'Batería reemplazada y pasta térmica reaplicada. Listo para recoger.',
      completedDate: 'Abr 28, 2025'
    },
    {
      id: 'ORD-8922B',
      status: 'RECIBIDO',
      statusColorClass: 'bg-blue-500',
      deviceName: 'Asus ROG Zephyrus G14',
      description: 'Dispositivo recibido. Diagnóstico inicial pendiente.',
    }
  ];

  get activeRepairs(): Repair[] {
    return this.allRepairs.filter(r => r.status !== 'COMPLETADO');
  }

  get completedRepairs(): Repair[] {
    return this.allRepairs.filter(r => r.status === 'COMPLETADO');
  }

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userName = user.Full_Name || user.name || user.username || '';
      } catch {
        this.userName = '';
      }
    }
  }
}
