import { useEscrowRest } from "../../provider";

/**
 * Status of a CCTP burn by the release tx hash (`GET /cctp/attestation/:hash`).
 */
export function useGetCctpAttestation() {
  const rest = useEscrowRest();

  return {
    getCctpAttestation: (burnTxHash: string) =>
      rest.getCctpAttestation(burnTxHash),
  };
}
