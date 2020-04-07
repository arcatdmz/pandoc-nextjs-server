import { FC } from "react";
import Head from "next/head";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Grid, Cell } from "baseui/layout-grid";

import { Header } from "../components/Header";
import { Steps, PandocStep } from "../components/Steps";
import { useStyletron } from "baseui";
import { ParagraphMedium } from "baseui/typography";

interface IProps {
  title?: string;
  step: PandocStep;
}

export const Layout: FC<IProps> = ({ title, step, children }) => {
  const [css] = useStyletron();
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ""}pandoc-nextjs-server</title>
      </Head>
      <div
        className={css({
          position: "fixed",
          width: "100%",
        })}
      >
        <Header />
      </div>
      <div
        className={css({
          position: "fixed",
          top: "60px",
          right: "1em",
          bottom: "0",
          left: "1em",
          overflowY: "auto",
        })}
      >
        <FlexGrid
          alignContent="safe center"
          alignItems="center"
          minHeight="100%"
        >
          <FlexGridItem>
            <Grid>
              <Cell span={[3, 2, 2]}>
                <Steps step={step} />
              </Cell>
              <Cell span={[5, 6, 10]}>{children}</Cell>
            </Grid>
          </FlexGridItem>
        </FlexGrid>
      </div>
    </>
  );
};
