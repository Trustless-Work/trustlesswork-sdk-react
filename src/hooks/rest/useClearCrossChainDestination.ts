import { useEscrowRest } from "../../provider";
import {
  MultiReleaseClearCrossChainDestinationPayload,
  SingleReleaseClearCrossChainDestinationPayload,
} from "../../types/types.payload";
import { EscrowType } from "../../types/types";

/**
 * Receiver removes the CCTP destination; the payout goes back to Stellar.
 */
export function useClearCrossChainDestination() {
  const rest = useEscrowRest();

  return {
    clearCrossChainDestination: (
      payload:
        | SingleReleaseClearCrossChainDestinationPayload
        | MultiReleaseClearCrossChainDestinationPayload,
      type: EscrowType
    ) => rest.clearCrossChainDestination(payload, type),
  };
}
