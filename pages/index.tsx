import { useCallback } from "react";
import { NextPage } from "next";
import Router from "next/router";

import { Layout } from "../components/Layout";
import { PandocStep } from "../components/Steps";
import { UploadStep } from "../components/UploadStep";

const Index: NextPage = () => {
  const handleUpload = useCallback(({ name }) => {
    Router.push(`/convert/${name}`);
  }, []);
  return (
    <Layout step={PandocStep.Upload}>
      <UploadStep onUpload={handleUpload} />
    </Layout>
  );
};

export default Index;
