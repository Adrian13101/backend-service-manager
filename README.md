# Service Manager

Administrador de servicios para un sistema de turnos y reservas, hecho con Node.js (ESM). Incluye la clase `ServiceManager`, que permite listar, buscar, agregar, actualizar y eliminar servicios, guardándolos en un archivo JSON.

## Instalación

```bash
git clone <URL-DEL-REPOSITORIO>
cd service-manager
npm install
cp .env.example .env
```

Después completá los valores del archivo `.env`.

## Ejecución

```bash
npm start
```

`src/app.js` ejecuta un ejemplo que usa todos los métodos del `ServiceManager`. También está disponible `npm run dev` (reinicia al guardar cambios).

## Variables de entorno

| Variable   | Descripción                  | Ejemplo       |
|------------|------------------------------|---------------|
| `PORT`     | Puerto de la aplicación      | `8080`        |
| `NODE_ENV` | Entorno de ejecución         | `development` |

Si falta alguna, la aplicación termina al iniciar con un mensaje que indica cuál.

## Estructura

```
src/
  config/env.config.js       # carga y valida variables de entorno
  managers/ServiceManager.js # lógica de servicios
  data/services.json         # persistencia
  app.js                     # ejemplo de uso
```

## Recurso `services`

Cada servicio tiene esta forma:

```js
{
  id: 1,                       // generado automáticamente
  name: "Corte de pelo",
  description: "Corte clásico con lavado incluido",
  duration: 30,                // minutos
  price: 5000,
  category: "peluquería",
  available: true
}
```

## Métodos de `ServiceManager`

Todos son asíncronos (usan `await`).

```js
import ServiceManager from "./managers/ServiceManager.js";

const manager = new ServiceManager("./src/data/services.json");
```

- `getServices()`: devuelve el array con todos los servicios.
  ```js
  const services = await manager.getServices();
  ```
- `getServiceById(id)`: devuelve el servicio o `null` si no existe.
  ```js
  const service = await manager.getServiceById(1);
  ```
- `addService(serviceData)`: agrega un servicio. El `id` se genera internamente (si se envía, se ignora). Lanza un error si falta alguno de `name`, `description`, `duration`, `price`, `category`, `available`.
  ```js
  const created = await manager.addService({
    name: "Depilación",
    description: "Depilación con cera",
    duration: 40,
    price: 6000,
    category: "estética",
    available: true,
  });
  ```
- `updateService(id, updatedData)`: actualiza los campos indicados. No permite modificar el `id`. Devuelve el servicio actualizado o `null` si no existe.
  ```js
  const updated = await manager.updateService(1, { price: 5500 });
  ```
- `deleteService(id)`: elimina el servicio y lo devuelve, o `null` si no existe.
  ```js
  const deleted = await manager.deleteService(1);
  ```
