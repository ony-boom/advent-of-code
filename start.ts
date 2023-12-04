import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import { existsSync } from "https://deno.land/std@0.208.0/fs/exists.ts";

const flags = parse(Deno.args, {
  string: ["years", "day"],
  alias: { years: "y", day: "d" },
});

const year = new Date().getFullYear();

flags.years ||= flags.y || year.toString();
flags.day ||= flags.d || "1";

if (!flags.years || !flags.day) {
  throw new Error("Please provide both --years and --day");
}

const modulePath = `./${flags.years}/day-${flags.day}/main.ts`;

const moduleExist = existsSync(modulePath);

if (!moduleExist) {
  throw new Error(`Could not find module ${modulePath}`);
}

await import(modulePath);
