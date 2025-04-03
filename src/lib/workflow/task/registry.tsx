import { TaskType } from "@/types/task";
import { ExtractTextFromELEMENT } from "./ExtractTextFromELEMENT";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtml,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromELEMENT,
};
