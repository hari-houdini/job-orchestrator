import { runBiographer } from "./biographer.js";
import { runDispatcher } from "./dispatcher.js";
import { runGmailSync } from "./gmail-sync.js";
import { runScout } from "./scout.js";

/**
 * Entrypoint the daily GitHub Actions workflow invokes. Runs the four stages
 * in sequence — each is independently useful (see their own scripts), but a
 * full day's run is Scout -> Biographer -> Dispatcher, with Gmail sync
 * folded in since it shares the same daily cadence and doesn't need its own
 * schedule.
 */
async function main(): Promise<void> {
  await runScout();
  await runBiographer();
  await runDispatcher();
  await runGmailSync();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
