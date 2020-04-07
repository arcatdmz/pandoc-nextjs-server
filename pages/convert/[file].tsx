import { useEffect, useState, useCallback } from "react";
import { NextPage } from "next";
import Router from "next/router";
import axios from "axios";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { StyledSpinnerNext as Spinner } from "baseui/spinner";

import { Layout } from "../../components/Layout";
import { PandocStep } from "../../components/Steps";
import { IStatus, UploadStatus } from "../../components/UploadStatus";
import { ParagraphMedium } from "baseui/typography";

interface IProps {
  file: string;
}

const Index: NextPage<IProps> = ({ file }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<IStatus>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let fetch: Function = () => {
      axios
        .get("/api/status", {
          params: {
            file,
          },
          responseType: "json",
        })
        .then((res) => {
          setLoading(false);
          if (res.data && res.data.success) {
            setStatus(res.data.status);
          }
          if (fetch) {
            setTimeout(fetch, 1000);
          }
        });
    };
    fetch();
    return () => (fetch = null);
  }, []);

  const handleDownload = useCallback(({ name }) => {
    Router.push(`/download/${name}`);
  }, []);

  return (
    <Layout title="Convert" step={PandocStep.Convert}>
      {loading || !status ? (
        <FlexGrid alignItems="center" justifyContent="center" height="100%">
          <FlexGridItem>
            <p style={{ textAlign: "center" }}>
              <Spinner />
            </p>
          </FlexGridItem>
        </FlexGrid>
      ) : (
        <>
          <UploadStatus status={status} onDownload={handleDownload} />
          <ParagraphMedium>
            Once the file is ready, the button above gets enabled. The
            conversion status is updated every second.
          </ParagraphMedium>
        </>
      )}
    </Layout>
  );
};

Index.getInitialProps = async ({ query }) => {
  const { file } = query;
  if (typeof file === "string") {
    return { file };
  } else {
    return { file: null };
  }
};

export default Index;
