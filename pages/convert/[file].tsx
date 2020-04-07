import { useEffect, useContext } from "react";
import { NextPage } from "next";

interface IProps {
  file: string;
}

const Index: NextPage<IProps> = ({ file }) => {
  return <p>{file}</p>;
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
