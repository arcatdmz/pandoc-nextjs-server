import { useEffect, useState, useCallback } from "react";
import { NextPage } from "next";
import Router from "next/router";
import axios from "axios";
import { useStyletron } from "baseui";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { StyledSpinnerNext as Spinner } from "baseui/spinner";
import { ParagraphMedium, HeadingSmall } from "baseui/typography";

import { Layout } from "../../components/Layout";
import { PandocStep } from "../../components/Steps";
import { UploadStatus } from "../../components/UploadStatus";

import { IStatus } from "../../lib/writeMetaFile";
import { ScrapboxForm } from "../../components/ScrapboxForm";

interface IProps {
  file: string;
}

const Index: NextPage<IProps> = ({ file }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [polling, setPolling] = useState<boolean>(true);
  const [status, setStatus] = useState<IStatus>(null);
  const [css] = useStyletron();

  const fetch = useCallback(async () => {
    let status: IStatus;
    try {
      const res = await axios.get("/api/status", {
        params: {
          file,
        },
        responseType: "json",
      });
      if (res.data && res.data.success) {
        status = res.data.status;
      }
    } catch (e) {
      return null;
    }
    return status;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !polling) {
      return;
    }
    let doFetch = () =>
      fetch().then((status) => {
        if (!doFetch || !polling) {
          return;
        }
        setLoading(false);
        setStatus(status);
        if (status.scrapbox) {
          setPolling(false);
        } else {
          setTimeout(doFetch, 1000);
        }
      });
    doFetch();
    return () => (doFetch = null);
  }, [fetch, polling]);

  const handleDownload = useCallback((name: string) => {
    Router.push(`/download/${name}`);
  }, []);

  const handleSubmit = useCallback(() => {
    setPolling(true);
  }, []);

  return (
    <Layout title="Convert" step={PandocStep.Convert}>
      {loading || !status ? (
        <FlexGrid alignItems="center" justifyContent="center" height="100%">
          <FlexGridItem>
            <div className={css({ textAlign: "center" })}>
              <Spinner />
            </div>
          </FlexGridItem>
        </FlexGrid>
      ) : status.scrapbox ? (
        <>
          <HeadingSmall marginTop="0">Scrapbox options</HeadingSmall>
          <ScrapboxForm status={status} onSubmit={handleSubmit} />
          <ParagraphMedium padding=".2em">
            Specify options for converting Scrapbox pages and click the convert
            button.
          </ParagraphMedium>
        </>
      ) : (
        <>
          <HeadingSmall marginTop="0">File conversion status</HeadingSmall>
          <UploadStatus status={status} onDownload={handleDownload} />
          <ParagraphMedium padding=".2em">
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
