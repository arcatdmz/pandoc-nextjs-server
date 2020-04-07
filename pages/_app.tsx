import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { styletron, debug } from "../styletron";

const MyApp = ({ Component, pageProps }) => (
  <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
    <BaseProvider theme={LightTheme}>
      <Component {...pageProps} />
    </BaseProvider>
  </StyletronProvider>
);

export default MyApp;
