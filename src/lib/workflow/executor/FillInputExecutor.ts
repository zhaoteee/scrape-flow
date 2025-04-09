import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { FillInputTask } from "../task/FilInputTask";
import { waitFor } from "@/lib/helpers/waitFor";
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input -> value not defined");
    }
    await environment.getPage()?.type(selector, value);
    await waitFor(2000);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
