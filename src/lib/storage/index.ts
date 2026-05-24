import { LocalStorageVinodexStorage } from "./localStorageStorage";
import type { VinodexStorage } from "./types";

export type { VinodexStorage } from "./types";

// Single shared instance. Swap this line when introducing a new backend
// (e.g., an HTTP-backed storage), and the rest of the app keeps working.
export const storage: VinodexStorage = new LocalStorageVinodexStorage();
