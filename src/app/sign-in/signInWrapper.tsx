"use client";

import { signIn } from "@/utils/client/auth";
import { useEffect } from "react";

export const SignInWrapper = ({ callbackURL = "/" }: { callbackURL?: string }) => {
  useEffect(() => {
    const login = async () => {
      await signIn.social({ provider: "diamond", callbackURL });
    };

    login();
  }, [callbackURL]);

  return null;
};
