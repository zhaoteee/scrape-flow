import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { OpenAI } from "openai";
export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input -> credentials not defined");
      return false;
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input -> prompt not defined");
      return false;
    }
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input -> content not defined");
      return false;
    }
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }
    const plainCredentialValu = symmetricDecrypt(credential.value);
    if (!plainCredentialValu) {
      environment.log.error("cannot decrypt credential");
      return false;
    }
    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };
    // environment.setOutput("Extract data", JSON.stringify(mockExtractedData));
    const openai = new OpenAI({
      apiKey: plainCredentialValu,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });
    const response = await openai.chat.completions.create({
      model: "qwen-plus-2025-01-25",
      messages: [
        {
          role: "system",
          content: `You are a webscraper helper that extracts data from HTML or text.
             You will be given a piece of text or HTMl content as input and also
             the prompt with the data you have to extract. The response should
             always be only the extracted data as a JSON array or object, without
             any additional words or explanations. Analyze the input carefully
             and extract data precisely based on the prompt. If no data is
             found, run an empty JSON array. Work only with the provided content and
             ensure the output is always a valid JSON without any surrounding text,
              which i can use JSON.parse method to parse this JSON
             ,`,
        },
        {
          role: "user",
          content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });
    environment.log.info(
      `qwen-plus-2025-01-25 -> Prompt tokens: ${response.usage?.prompt_tokens}`
    );

    environment.log.info(
      `qwen-plus-2025-01-25 ->Completition tokens: ${response.usage?.completion_tokens}`
    );
    const result = response.choices[0].message.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }
    environment.setOutput("Extract data", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

/**
  Extarct in a JSON object the selector for the username field, password field and login btn。
  Use properties usenameSelector,passwordSelector and loginSelector as properties in the resulting JSON
 
 * 
 */
