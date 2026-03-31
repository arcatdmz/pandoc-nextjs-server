import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { Provider as StyletronProvider } from "styletron-react";
import { Server } from "styletron-engine-atomic";
import type { sheetT as StyletronSheet } from "styletron-engine-atomic/lib/server/server";
import { styletron } from "../lib/styletron";

class MyDocument extends Document<{ stylesheets: StyletronSheet[] }> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { stylesheets: StyletronSheet[] }> {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          (
            <StyletronProvider value={styletron}>
              <App {...props} />
            </StyletronProvider>
          ),
      });
    const initialProps = await Document.getInitialProps(ctx);
    const stylesheets = (styletron as Server).getStylesheets() || [];
    return { ...initialProps, stylesheets };
  }

  render() {
    return (
      <Html>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs["data-hydrate"]}
              key={i}
            />
          ))}
          <link rel="stylesheet" href="/index.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
