import { AccessRuntime, loadAccessRuntimeConfig } from "./runtime.js";

const config = loadAccessRuntimeConfig();
if (!config) throw new Error("access runtime is not configured");

const runtime = new AccessRuntime(config);
try {
  if (!await runtime.resendPendingInitialSuperuserActivation()) {
    throw new Error("initial-superuser activation resend is not applicable");
  }
  process.stdout.write("initial-superuser activation sent\n");
} finally {
  await runtime.close();
}
