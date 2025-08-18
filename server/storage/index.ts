import { DatabaseStorage } from "./DatabaseStorage";
import type { IStorage } from "./interfaces/IStorage";

export const storage = new DatabaseStorage();
export type { IStorage };
export { DatabaseStorage };
