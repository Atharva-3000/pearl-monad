/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import OpenAI from "openai";
import { createAssistant } from "@/agent/openai/createAssistant";
import { createThread } from "@/agent/openai/createThread";
import { createRun } from "@/agent/openai/createRun";
import { performRun } from "@/agent/openai/performRun";

const client = new OpenAI();

// Cache for assistant and threads
let cachedAssistant: any = null;

// Initialize or get cached assistant
export async function initializeAgent() {
  try {
    // Create or get cached assistant
    if (!cachedAssistant) {
      cachedAssistant = await createAssistant(client);
      console.log("Created or retrieved assistant:", cachedAssistant.id);
    }

    // Return the assistant object directly, not a function
    return cachedAssistant;
    
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw error;
  }
}

// Optional: Function to clear cache if needed
export function clearAgentCache() {
  cachedAssistant = null;
}