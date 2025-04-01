import React from "react";
import * as AuthSession from "expo-auth-session";
import { fetchAPI } from "./fetch";

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    // Start the authentication process by calling `startSSOFlow()`
    const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      // For web, defaults to current path
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "myapp",
        path: "/(root)/(tabs)/home",
      }),
    });

    // If sign in was successful, set the active session
    if (createdSessionId && setActive) {
      setActive!({ session: createdSessionId });

      if (signUp.createdUserId) {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: `${signUp.user?.firstName} ${signUp.user?.lastName}`,
            email: signUp.emailAddress,
            clerkId: signUp.createdUserId,
          }),
        });
      }

      return {
        success: true,
        code: "success",
        message: "Signed in successfully",
      };
    }
    return {
      success: false,
      code: "success",
      message: "Sign in failed",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      code: error?.errors[0].code,
      message: error?.errors[0].longMessage,
    };
  }
};
