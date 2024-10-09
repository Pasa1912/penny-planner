import { useCallback } from "react";

import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount";

type Props = {
  account: string;
  accountId: string;
};

export const Account = ({ account, accountId }: Props): JSX.Element => {
  const { onOpen } = useOpenAccount();

  const handleClick = useCallback(() => onOpen(accountId), [onOpen, accountId]);

  return (
    <span
      onClick={handleClick}
      className="flex justify-center items-center cursor-pointer hover:underline"
    >
      {account}
    </span>
  );
};
