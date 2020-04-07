import { useEffect, useRef, useState, useCallback } from "react";
import { NextPage } from "next";
import axios from "axios";
import { FileUploader } from "baseui/file-uploader";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Grid, Cell } from "baseui/layout-grid";

import { Header } from "../components/Header";
import { Steps, PandocStep } from "../components/Steps";

const Index: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  const handleUploadProgress = useCallback((progressEvent) => {
    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: File[]) => {
      // handle errors
      if (rejectedFiles.length > 0) {
        if (rejectedFiles.length > 1) {
          setErrorMessage("Too many files");
          return;
        }
        setErrorMessage("Something wrong happened");
        return;
      }

      // start uploading a file
      const data = new FormData();
      acceptedFiles.forEach((file, i) => {
        data.append(`files[${i}]`, file);
      });
      axios
        .post("/api/upload", data, {
          onUploadProgress: handleUploadProgress,
        })
        .then(() => {});
      setErrorMessage("");
    },
    []
  );

  const handleCancel = useCallback(() => {
    setErrorMessage("Upload cancelled");
  }, []);

  const handleRetry = useCallback(() => {
    setProgress(null);
    setErrorMessage("");
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
              <FileUploader
                // multiple={false}
                onCancel={handleCancel}
                onDrop={handleDrop}
                onRetry={handleRetry}
                progressAmount={progress}
                progressMessage={
                  progress ? `Uploading... ${progress}% of 100%` : ""
                }
                errorMessage={errorMessage}
              />
            </Cell>
          </Grid>
        </FlexGridItem>
      </FlexGrid>
    </>
  );
};

export default Index;
