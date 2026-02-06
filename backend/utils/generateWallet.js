import Arweave from "arweave";
import fs from "fs";

// Initialize Arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// Generate a new wallet
async function generateWallet() {
  try {
    console.log("Generating new Arweave wallet...");

    const wallet = await arweave.wallets.generate();
    const address = await arweave.wallets.jwkToAddress(wallet);

    console.log("Wallet generated successfully!");
    console.log("Address:", address);
    console.log("Wallet JSON:", JSON.stringify(wallet, null, 2));

    // Save wallet to file
    const walletPath = "./arweave-wallet.json";
    fs.writeFileSync(walletPath, JSON.stringify(wallet, null, 2));
    console.log(`Wallet saved to: ${walletPath}`);

    console.log("\n⚠️  IMPORTANT:");
    console.log("1. Keep this wallet file secure and private");
    console.log("2. Fund this wallet with AR tokens at https://arweave.net");
    console.log(
      "3. Add the wallet JSON to your ARWEAVE_WALLET_KEY environment variable",
    );
    console.log("4. Never commit the wallet file to version control");
  } catch (error) {
    console.error("Error generating wallet:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateWallet();
}

export { generateWallet };
