import { useCallback } from "react";
import { NextPage } from "next";
import axios from "axios";
import { Button } from "baseui/button";
import { ParagraphMedium, HeadingSmall } from "baseui/typography";

import { Layout } from "../../components/Layout";
import { PandocStep } from "../../components/Steps";
import { IStatus } from "../../components/UploadStatus";

import appConfig from "../api/_config";

interface IProps {
  status: IStatus;
}

const Index: NextPage<IProps> = ({ status }) => {
  const handleClick = useCallback(() => {
    const format = appConfig.formats.find((f) => f.value === status.format);
    location.href = `/api/download?file=${status.name}&ext=${
      format.ext || format.value
    }`;
  }, [status]);

  return (
    <Layout title="Download" step={PandocStep.Download}>
      <HeadingSmall marginTop="0">File download</HeadingSmall>
      <ParagraphMedium padding=".2em">
        {status ? (
          <Button onClick={handleClick}>Download the file</Button>
        ) : (
          <>File not found.</>
        )}
      </ParagraphMedium>
    </Layout>
  );
};

Index.getInitialProps = async ({ query }) => {
  const { file } = query;
  if (typeof file === "string") {
    try {
      const res = await axios.get("http://localhost:3000/api/status", {
        params: {
          file,
        },
        responseType: "json",
      });
      if (res.data && res.data.success) {
        return { status: res.data.status };
      }
    } catch (err) {
      // do nothing
    }
  }
  return { status: null };
};

export default Index;
