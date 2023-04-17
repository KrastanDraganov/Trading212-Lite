type FlowT = {
  firstStep: number;
  maxSteps: number;
  customerDetailsStep: number;
  loginDetailsStep: number;
};

export const SignUpFlowConfiguration: FlowT = {
  firstStep: 0,
  maxSteps: 2,
  customerDetailsStep: 0,
  loginDetailsStep: 1,
};
