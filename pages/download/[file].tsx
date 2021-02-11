import { useCallback } from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { Button } from "baseui/button";
import { ParagraphMedium, HeadingSmall } from "baseui/typography";

import { Layout } from "../../components/Layout";
import { PandocStep } from "../../components/Steps";

import appConfig from "../../lib/config";
import { IStatus } from "../../lib/writeMetaFile";

interface IProps {
  status: IStatus;
}

interface IPageProps {
  file: string;
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

export const getServerSideProps: GetServerSideProps<IProps> = async (ctx) => {
  const { file } = ctx.query;
  if (typeof file === "string") {
    try {
      const res = await axios.get("http://localhost:3000/api/status", {
        params: {
          file,
        },
        responseType: "json",
      });
      if (res.data && res.data.success) {
        return { props: { status: res.data.status } };
      }
    } catch (err) {
      // do nothing
    }
  }
  return { props: { status: null } };
};

export default Index;
