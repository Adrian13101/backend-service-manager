import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manager = new ServiceManager(path.join(__dirname, "data", "services.json"));

console.log(`Entorno: ${config.nodeEnv} | Puerto configurado: ${config.port}\n`);

console.log("Todos los servicios:", await manager.getServices());
console.log("Servicio con id 1:", await manager.getServiceById(1));
console.log("Servicio inexistente (id 999):", await manager.getServiceById(999));

try {
  await manager.addService({ name: "Solo nombre" });
} catch (error) {
  console.log("Servicio incompleto rechazado:", error.message);
}

const created = await manager.addService({
  id: 999, // se ignora: el id se genera internamente
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 6000,
  category: "estética",
  available: true,
});
console.log("Servicio agregado:", created);

console.log(
  "Servicio actualizado:",
  await manager.updateService(created.id, { id: 123, price: 6500 })
);
console.log("Actualizar inexistente:", await manager.updateService(999, { price: 1 }));

console.log("Servicio eliminado:", await manager.deleteService(created.id));
console.log("Eliminar inexistente:", await manager.deleteService(999));
