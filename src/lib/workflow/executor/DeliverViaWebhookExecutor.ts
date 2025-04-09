import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../task/CllickElement";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";
export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("Target URL");
    if (!url) {
      environment.log.error("input -> targetUrl not defined");
    }
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input -> body not defined");
    }
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      environment.log.error(`status code: ${res.status}`);
      return false;
    }
    const resBody = await res.json();
    environment.log.info(JSON.stringify(resBody, null, 4));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
