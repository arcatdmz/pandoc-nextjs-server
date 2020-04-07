import { NextPage } from "next";
import Router from "next/router";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Grid, Cell } from "baseui/layout-grid";

import { Header } from "../components/Header";
import { Steps, PandocStep } from "../components/Steps";
import { UploadStep } from "../components/UploadStep";
import { useCallback } from "react";

const Index: NextPage = () => {
  const handleUpload = useCallback(({ name }) => {
    console.log("handle upload", name);
    Router.push(`/convert/${name}`);
  }, []);
  return (
    <>
      <Header />
      <FlexGrid
        alignContent="safe center"
        alignItems="center"
        padding="2em"
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
      >
        <FlexGridItem>
          <Grid>
            <Cell span={[3, 2]}>
              <Steps step={PandocStep.Upload} />
            </Cell>
            <Cell span={[5, 6]}>
              <UploadStep onUpload={handleUpload} />
            </Cell>
          </Grid>
        </FlexGridItem>
      </FlexGrid>
    </>
  );
};

export default Index;
