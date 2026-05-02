import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";

export interface UserConfig {
    User_ID?: number;
    Full_Name: string;
    Phone: string;
    Email: string;
    Role: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    // Obtener datos de usuario 
    getUserConfig(userId: number): Observable<UserConfig> {
        return this.http.get<UserConfig>(`${this.apiUrl}/config/${userId}`);
    }

    // Actualizar datos de usuario (Nombre y Teléfono solamente)
    updateConfiguracion(userId: number, data: { Full_Name: string, Phone: string }): Observable<UserConfig> {
        return this.http.put<UserConfig>(`${this.apiUrl}/config/${userId}`, data);
    }

    // Actualizar contraseña (función aparte)
    updatePassword(userId: number, data: { currentPassword: string, newPassword: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/config/${userId}/password`, data);
    }
}
