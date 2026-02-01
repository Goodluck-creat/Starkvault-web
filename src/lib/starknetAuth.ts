import { connect } from "get-starknet";

export async function connectAndSign(message: string) {
  // safer: try "neverAsk" first to detect wallet
  const wallet = await connect({ modalMode: "neverAsk" });

  if (!wallet) {
    // optional: open modal to ask user to install or select wallet
    throw new Error("No StarkNet wallet detected. Please install ArgentX or Braavos.");
  }

  await wallet.enable();

  const signature = await wallet.account.signMessage({
    domain: { name: "StarkVault", version: "1" },
    types: {
      StarkVault: [{ name: "message", type: "string" }],
    },
    primaryType: "StarkVault",
    message: { message },
  });

  return {
    address: wallet.selectedAddress,
    signature,
  };
}
