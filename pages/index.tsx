import { NextPage } from "next";
import { FileUploader } from "baseui/file-uploader";
import { useStyletron } from "baseui";
import { useState } from "react";

const Index: NextPage = () => {
  const [css, theme] = useStyletron();
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <>
      <FileUploader errorMessage={errorMessage} />
      <p className={css({ color: theme.colors.accent600 })}>Styled by hook</p>
    </>
  );
};

export default Index;
