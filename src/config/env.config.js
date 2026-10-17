import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = ["PORT", "NODE_ENV"];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `Error de configuración: faltan las variables de entorno requeridas: ${missing.join(", ")}.\n` +
      "Copiá .env.example a .env y completá los valores."
  );
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};
