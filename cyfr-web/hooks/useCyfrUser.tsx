import { useState, useEffect } from "react";

export type UseCyfrUser = [
  any,
  React.Dispatch<React.SetStateAction<any>>
];

export const useCyfrUser = (newOpenValue: any|null): UseCyfrUser => {
  const [cyfrUser, setCyfrUser] = useState(null);

  useEffect(() => {
    setCyfrUser(newOpenValue);
  }, [newOpenValue]);

  return [cyfrUser, setCyfrUser];
};
