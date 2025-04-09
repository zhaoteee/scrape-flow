import { waitFor } from "@/lib/helpers/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      headless: false,
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(url);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${url}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
