import type { AppProps } from "next/app";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { styletron, debug } from "../lib/styletron";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
    <BaseProvider theme={LightTheme}>
      <Component {...pageProps} />
    </BaseProvider>
  </StyletronProvider>
);

export default MyApp;
