import { useEscrowRest } from "../../provider";
import {
  MultiReleaseGetCrossChainDestinationParams,
  SingleReleaseGetCrossChainDestinationParams,
} from "../../types/types.payload";
import { EscrowType } from "../../types/types";

/**
 * Registered CCTP destination, or `null` for a Stellar payout.
 * Multi-release requires `milestoneIndex`.
 */
export function useGetCrossChainDestination() {
  const rest = useEscrowRest();

  return {
    getCrossChainDestination: (
      params:
        | SingleReleaseGetCrossChainDestinationParams
        | MultiReleaseGetCrossChainDestinationParams,
      type: EscrowType
    ) => rest.getCrossChainDestination(params, type),
  };
}
