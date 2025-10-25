# Sistema de Eventos - Frontend

Este es el frontend de la aplicación de gestión de eventos, desarrollado con Angular.

## Características

- **Login y Registro**: Sistema de autenticación básico sin JWT
- **Visualización de Eventos**: Interfaz sencilla para mostrar eventos
- **Navegación**: Routing entre diferentes vistas
- **Diseño Responsivo**: Interfaz adaptada para diferentes dispositivos

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend de eventos ejecutándose en `http://localhost:3000`

## Instalación

1. Navega al directorio del proyecto:
```bash
cd eventos-frontend
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución

### Modo Desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Compilación para Producción
```bash
ng build
```

Los archivos compilados se generarán en la carpeta `dist/eventos-frontend`

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Componente de inicio de sesión
│   │   ├── register/       # Componente de registro
│   │   └── eventos/        # Componente de visualización de eventos
│   ├── models/
│   │   ├── usuario.model.ts    # Interfaces para usuarios
│   │   └── evento.model.ts     # Interfaces para eventos
│   ├── services/
│   │   ├── auth.ts         # Servicio de autenticación
│   │   └── eventos.service.ts  # Servicio para eventos
│   ├── app.routes.ts       # Configuración de rutas
│   └── app.config.ts       # Configuración de la aplicación
```

## Funcionalidades

### Autenticación
- **Login**: Permite iniciar sesión con usuario y contraseña
- **Registro**: Permite crear nuevas cuentas de usuario
- **Logout**: Cierra la sesión del usuario actual

### Eventos
- **Lista de Eventos**: Muestra todos los eventos disponibles
- **Información Detallada**: Cada evento muestra:
  - Nombre del evento
  - Descripción
  - Fecha y hora
  - Ubicación
  - Organizador

## Configuración del Backend

Asegúrate de que el backend esté ejecutándose en `http://localhost:3000` con los siguientes endpoints:

- `POST /tus_eventos/usuarios/login` - Inicio de sesión
- `POST /tus_eventos/usuarios` - Registro de usuario
- `GET /tus_eventos/eventos` - Obtener todos los eventos

## Tecnologías Utilizadas

- **Angular 18**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **CSS3**: Estilos y diseño responsivo

## Notas de Desarrollo

- La aplicación utiliza standalone components de Angular
- No se implementó autenticación JWT (como se solicitó)
- Las contraseñas se manejan "en crudo" desde la base de datos
- La interfaz está diseñada para ser sencilla y funcional"# eventos-frontend" 
