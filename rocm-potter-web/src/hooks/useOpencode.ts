import { useContext } from "react";
import { OpencodeCtx } from "../context/OpencodeContext";

export function useOpencode() {
  return useContext(OpencodeCtx);
}
