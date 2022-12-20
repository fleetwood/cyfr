import * as React from "react";
import { useCyfrUser, UseCyfrUser } from "./../../hooks/useCyfrUser";
import { createGenericContext } from "./createGenericContext";

interface Props {children: React.ReactNode;}

// Generate context
const [useCyfrUserContext, CyfrUserContextProvider] = createGenericContext<UseCyfrUser>();

// Generate provider
const CyfrUserProvider = ({ children }: Props) => {
  const [cyfrUser, setCyfrUser] = useCyfrUser(null);

  return (
    <CyfrUserContextProvider value={[cyfrUser, setCyfrUser]}>
      {children}
    </CyfrUserContextProvider>
  );
};

export { useCyfrUserContext, CyfrUserProvider };
