import { ProgressSteps, Step } from "baseui/progress-steps";
import { FC } from "react";

export enum PandocStep {
  Upload = 0,
  Convert = 1,
  Download = 2,
}

interface IProps {
  step: PandocStep;
}

export const Steps: FC<IProps> = ({ step }) => {
  return (
    <ProgressSteps current={step}>
      <Step title="Upload" />
      <Step title="Convert" />
      <Step title="Download" />
    </ProgressSteps>
  );
};
