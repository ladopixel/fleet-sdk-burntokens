import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Text,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

import { TransactionBuilder } from "@fleet-sdk/core";

declare global {
  interface Window {
    ergoConnector: any;
  }
}
declare var ergo: any;
var connected: any;

export const App = () => {

  const [tx, setTx] = useState('...');

  useEffect(() => {
    // burn_tokens();
  }, []);

  async function burn_tokens(): Promise<void> { 
    connected = await window.ergoConnector.nautilus.connect(); 
    if (connected) {
      const height = await ergo.get_current_height();
      const unsignedTx = new TransactionBuilder(height)

        .burnTokens({ 
          tokenId: "066c87b7ce7e05ee72ce6f964122661c7d778f8cf6ada194cc023bf5f976ab5c", 
          amount: "12"
        })

        .from(await ergo.get_utxos())
        .sendChangeTo(await ergo.get_change_address())
        .payMinFee()
        .build()
        .toEIP12Object();
        
      const signedTx = await ergo.sign_tx(unsignedTx);
      const txId = await ergo.submit_tx(signedTx);
      setTx(txId);
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text as='mark'>
            tx ID: {tx}
          </Text>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
