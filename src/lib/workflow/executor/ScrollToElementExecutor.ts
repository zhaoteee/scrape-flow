import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../task/CllickElement";
import { ScrollToElementTask } from "../task/ScrollToElement";
export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
    }
    await environment.getPage()?.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) {
        throw new Error("element not found");
      }
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
      waitFor(4000);
    }, selector);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
