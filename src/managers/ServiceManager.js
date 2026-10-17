import fs from "node:fs/promises";

const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

export default class ServiceManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(services) {
    await fs.writeFile(this.filePath, JSON.stringify(services, null, 2));
  }

  #generateId(services) {
    return services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
  }

  async getServices() {
    return this.#readFile();
  }

  async getServiceById(id) {
    const services = await this.#readFile();
    return services.find((s) => s.id === Number(id)) ?? null;
  }

  async addService(serviceData = {}) {
    const missing = REQUIRED_FIELDS.filter(
      (field) =>
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        serviceData[field] === ""
    );

    if (missing.length > 0) {
      throw new Error(`Servicio incompleto. Faltan campos: ${missing.join(", ")}`);
    }

    const services = await this.#readFile();

    // Se ignora cualquier id recibido: se genera internamente.
    const { name, description, duration, price, category, available } = serviceData;
    const newService = {
      id: this.#generateId(services),
      name,
      description,
      duration,
      price,
      category,
      available,
    };

    services.push(newService);
    await this.#writeFile(services);
    return newService;
  }

  async updateService(id, updatedData = {}) {
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === Number(id));

    if (index === -1) return null;

    // Se descarta el id para que no pueda modificarse.
    const { id: _ignored, ...safeData } = updatedData;
    services[index] = { ...services[index], ...safeData, id: services[index].id };

    await this.#writeFile(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === Number(id));

    if (index === -1) return null;

    const [deleted] = services.splice(index, 1);
    await this.#writeFile(services);
    return deleted;
  }
}
