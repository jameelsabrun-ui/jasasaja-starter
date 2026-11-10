import { parseEnv } from './env.schema';

// Satu-satunya tempat yang boleh membaca process.env (ditegakkan oleh ESLint).
export const env = parseEnv(process.env);
