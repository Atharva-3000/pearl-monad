import { Address } from "viem";
import { wMON_ABI } from "../abi/wMON-abi";
import { usdc_ABI } from "../abi/usdc-abi";
import { wETH_ABI } from "../abi/wETH-abi";
import { wBTC_ABI } from "../abi/wBTC-abi";
import { wSOL_ABI } from "../abi/wSOL-abi";
import { usdt_ABI } from "../abi/usdt-abi";
import { gMON_ABI } from "../abi/gMON-abi";

export const TOKENS = {
  usdc: {
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea" as Address,
    abi: usdc_ABI,
  },
  usdt: {
    address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D" as Address,
    abi: usdt_ABI,
  },
  wMON: {
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701" as Address,
    abi: wMON_ABI,
  },
  wETH: {
    address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" as Address,
    abi: wETH_ABI,
  },
  wBTC: {
    address: "0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d" as Address,
    abi: wBTC_ABI,
  },
  wSOL: {
    address: "0x5387C85A4965769f6B0Df430638a1388493486F1" as Address,
    abi: wSOL_ABI,
  },
  gMON: {
    address: "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3" as Address,
    abi: gMON_ABI,
  },
  
};
