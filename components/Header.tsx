import {
  ClerkLoaded,
  ClerkLoading,
  UserButton as UserButtonWithoutLoading,
} from "@clerk/nextjs";
import { HeaderLogo } from "./HeaderLogo";
import { Navigation } from "./Navigation";
import { Loader2 } from "lucide-react";
import { WelcomeMessage } from "./WelcomeMessage";

const UserButton = () => (
  <>
    <ClerkLoading>
      <Loader2 className="size-8 text-slate-400 animate-spin" />
    </ClerkLoading>
    <ClerkLoaded>
      <UserButtonWithoutLoading />
    </ClerkLoaded>
  </>
);

export const Header = () => (
  <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
    <div className="max-w-screen-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-14">
        <div className="flex items-center lg:gap-x-16">
          <HeaderLogo />
          <Navigation />
        </div>
        <UserButton />
      </div>
      <WelcomeMessage />
    </div>
  </header>
);
