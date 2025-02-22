"use client";

import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import one from "../../public/one.jpeg";
import two from "../../public/two.jpeg";
import three from "../../public/three.jpeg";
export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-full rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="normal"
      />
    </div>
  );
}

const testimonials = [
  {
    title: "What is P.E.A.R.L?",
    quote: "Parallel Enhanced AI for Rapid-Ledger Processing (P.E.A.R.L.) is an AI-driven platform designed for seamless interaction with blockchain protocols. It offers a comprehensive tool suite that autonomously engages with the blockchain on behalf of users, efficiently processing transactions and enhancing operational efficiency.",
    name: "Introduction",
    bgImage: one.src
  },
  {
    title: "Current Challenges",
    quote: "Interacting with blockchain protocols can be a complex and overwhelming experience, especially for non-technical users. Consider a simple transaction—sending 10 $MON from one user to another. First, you need to log into your wallet, then select the appropriate blockchain network, enter the recipient's address, specify the number of tokens, initiate the transaction, and finally, approve it. This multi-step process is far from a Seamless User Experience and serves as a significant barrier to user adoption in blockchain and crypto platforms. Simplifying this experience is crucial for improving accessibility and onboarding more users into the ecosystem.",
    name: "The Problem",
    bgImage: two.src
  },
  {
    title: "How P.E.A.R.L. Helps",
    quote: "P.E.A.R.L. redefines blockchain interaction by delivering an intuitive, chat-based interface powered by Large Language Models (LLMs). Instead of navigating complex multi-step processes, users can simply prompt P.E.A.R.L. with a command like \"Send 10 $MON to 0x123...\", and the system will autonomously execute the transaction. By abstracting intricate blockchain operations into a seamless, natural language experience, P.E.A.R.L. eliminates friction and enhances accessibility, making blockchain interactions as simple as having a conversation.",
    name: "The Solution",
    bgImage: three.src
  }
];
