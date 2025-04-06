import { ExecutionEnvironment } from "@/types/executor";
import * as cheerio from "cheerio";
import { ExtractTextFromELEMENT } from "../task/ExtractTextFromELEMENT";
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromELEMENT>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.error("Html not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      console.error("Element not found");
      return false;
    }
    const extractedText = $.text(element);
    if (!extractedText) {
      console.error("Element has no text");
    }
    environment.setOutput("Extracted text", extractedText);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
