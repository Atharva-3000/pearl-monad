import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {LRUCache} from "lru-cache"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateChatId = () => {
  return Math.random().toString(36).substring(7);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cache = new LRUCache<string, any>({
  max: 100, // maximum number of items
  ttl: 1000 * 60 * 60,
})
