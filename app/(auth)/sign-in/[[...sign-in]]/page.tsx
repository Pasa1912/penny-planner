import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-4 pt-16 lg:pt-0">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log In or Create Account to get back to your dashboard!
          </p>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded><SignIn path="/sign-in"/></ClerkLoaded>
            <ClerkLoading><Loader2 className="animate-spin text-muted-foreground"/></ClerkLoading>
          </div>
        </div>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex justify-center items-center">
        <Image src="/pennyPlanner.svg" height={100} width={100} alt="Penny Planner"/>
      </div>
    </div>
  );
}
