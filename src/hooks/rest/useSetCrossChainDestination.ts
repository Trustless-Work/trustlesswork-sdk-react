import { useEscrowRest } from "../../provider";
import {
  MultiReleaseSetCrossChainDestinationPayload,
  SingleReleaseSetCrossChainDestinationPayload,
} from "../../types/types.payload";
import { EscrowType } from "../../types/types";

/**
 * Receiver registers a CCTP payout destination (multi-release: per milestone).
 * Returns an unsigned XDR plus `estimatedFeeUsdc` to show before signing.
 */
export function useSetCrossChainDestination() {
  const rest = useEscrowRest();

  return {
    setCrossChainDestination: (
      payload:
        | SingleReleaseSetCrossChainDestinationPayload
        | MultiReleaseSetCrossChainDestinationPayload,
      type: EscrowType
    ) => rest.setCrossChainDestination(payload, type),
  };
}
