import { createServerFn } from "@tanstack/react-start";
import { detectCountryFromRequest } from "./market.server";

export const detectCountryFn = createServerFn({ method: "GET" }).handler(async () =>
  detectCountryFromRequest(),
);
