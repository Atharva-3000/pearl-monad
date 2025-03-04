import "dotenv/config";
import OpenAI from "openai";
import { createAssistant } from "@/agent/openai/createAssistant";

const client = new OpenAI();

// Cache for assistant and threads
let cachedAssistant: OpenAI.Beta.Assistants.Assistant | null = null;

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