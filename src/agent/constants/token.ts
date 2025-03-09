import { Address } from "viem";
import { wMON_ABI } from "../abi/wMON-abi";
import { usdc_ABI } from "../abi/usdc-abi";

export const TOKENS = {
  wMON: {
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701" as Address,
    abi: wMON_ABI,
  },
  usdc: {
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea" as Address,
    abi: usdc_ABI,
  }
};
