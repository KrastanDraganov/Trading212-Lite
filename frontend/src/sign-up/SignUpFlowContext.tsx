import { CountryT } from "customer-commons";
import { createContext, useState } from "react";

type SignUpFlowDataT = {
  countryName: CountryT["name"];
  givenNames: string;
  lastName: string;
  email: string;
};

type SignUpFlowContextT = [
  Partial<SignUpFlowDataT>,
  (userData: Partial<SignUpFlowDataT>) => void
];

const initialContext: SignUpFlowContextT = [{}, () => {}];

export const SignUpFlowContext =
  createContext<SignUpFlowContextT>(initialContext);

export function SignUpFlowContextProvider(props: {
  children: React.ReactElement;
}) {
  const [userData, setUserData] = useState<SignUpFlowContextT[0]>({});

  return (
    <SignUpFlowContext.Provider value={[userData, setUserData]}>
      {props.children}
    </SignUpFlowContext.Provider>
  );
}
