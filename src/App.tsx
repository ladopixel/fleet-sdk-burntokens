import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Text,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

import { OutputBuilder, TransactionBuilder } from "@fleet-sdk/core";

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
    send_token();
  }, []);

  async function send_token(): Promise<void> { 
    connected = await window.ergoConnector.nautilus.connect(); 
    if (connected) {
      const height = await ergo.get_current_height();
      const unsignedTx = new TransactionBuilder(height)
        .from(await ergo.get_utxos())
        .to(
          new OutputBuilder(
            "1000000", "9gBYZrMRNX66uN5VhLnTw6absspsarXPxcWSi5fuE5EesBfQC6s"
          )
          .addTokens({ 
            tokenId: 
              "bb010d9816e8371b6d3889eb2afeecfd8d79c391aa2ed2ff908774a9f3e32c2d",
            amount: "1", 
          }) 
        )
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
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text as='mark'>
            tx ID: {tx}
          </Text>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
