import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { handleRunToolCalls } from "./handleRunToolCalls";

// Define a type for the chunks that can be yielded
type StreamChunk = 
  | { agent: { messages: { content: string }[] } }
  | { text: { value: string } };

export async function* performRun(run: Run, client: OpenAI, thread: Thread): AsyncGenerator<StreamChunk> {
  console.log("Performing run: ", run.id);

  while (run.status === "requires_action" || run.status === "in_progress" || run.status === "queued") {
    // If run requires action, handle it
    if (run.status === "requires_action") {
      run = await handleRunToolCalls(run, client, thread);
      continue;
    }
    
    // Check if run is still in progress
    run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    
    // If completed or failed, break the loop
    if (run.status === "completed" || run.status === "failed") {
      break;
    }
    
    // Wait a bit before polling again
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (run.status === "failed") {
    const errorMessage = `Error: ${run.last_error?.message || "Unknown error"}`;
    console.error("Run failed: ", run.last_error);
    yield {
      agent: {
        messages: [{ content: errorMessage }]
      }
    };
    return;
  }

  // Get the latest messages after run completes
  const messages = await client.beta.threads.messages.list(thread.id);
  const assistantMessage = messages.data.find(
    (message) => message.role === "assistant"
  );

  if (!assistantMessage?.content[0]) {
    yield {
      agent: {
        messages: [{ content: "No response from assistant" }]
      }
    };
    return;
  }

  // Extract content from the message
  const content = typeof assistantMessage.content[0] === 'string'
    ? assistantMessage.content[0]
    : 'type' in assistantMessage.content[0] && assistantMessage.content[0].type === 'text'
      ? assistantMessage.content[0].text.value
      : "No readable response";

  // Send the full content only once
  yield {
    agent: {
      messages: [{ content }]
    }
  };
}
