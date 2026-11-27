import { useEscrowRest } from "../../provider";
import { CctpDestinationDomain } from "../../types/types.payload";

/**
 * Estimated CCTP forwarding fee for a destination (`GET /cctp/fee-quote/:domain`).
 */
export function useGetCctpFeeQuote() {
  const rest = useEscrowRest();

  return {
    getCctpFeeQuote: (destinationDomain: CctpDestinationDomain) =>
      rest.getCctpFeeQuote(destinationDomain),
  };
}
