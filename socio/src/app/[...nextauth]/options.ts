import { CallbacksOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {},
    authorize: async (credentials: any) => {
      // console.log(credentials, "credentialssss");
    //   {
    //     "userName": "New@gmail.com",
    //     "type": "Email",
    //     "token": "1c608549a6e8771fcab8b0bf4854b6a2cdeecf08d2cf1abfb04f52d193a5fc62.1739909130211",
    //     "countryCode": ""
    // }
      console.log(credentials, "test-1");
      try {
        if (
          credentials.userName &&
          credentials.type &&
          credentials.token &&
          credentials.countryCode
        ) {

          const payload = {
            username: credentials.phoneNumber,
            type: 'Email',
            token: credentials.otpToken,
            otp: credentials.otp,
            countryCode: 'string',
          };

          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (loginResponse.tokenInfo?.accessToken) {
            //add anything else locally if you want
            loginResponse.phoneNumber = convertedCredentials.phoneNumber;
            loginResponse.deviceInfo = parsedDeviceInfo;
            //this type casting is required since we are not using the default next-auth response
            return loginResponse as any;
          }
        }

        return null;
      } catch (error: any) {
        console.log(error, "error test final");
        const errorResponse = error.data;
        console.log(errorResponse, "errorResponse");
        const errorObj = JSON.stringify(errorResponse);
        throw new Error(errorObj);
      }
    },
  }),
];

const callbacks = (query?: URLSearchParams): Partial<CallbacksOptions> => {
  return {
    async signIn({ user, account }: any) {
      // if (account?.provider === "credentials") {
      //   let typeCastedUser =
      //     user as Partial<ITokenResponseModelWithAdditionalData>;
      //   if (typeCastedUser?.tokenInfo?.accessToken) {
      //     return true;
      //   }
      // }
      console.log(user, "user");
      return false;
    },

    jwt: async (jwtParamObject) => {
      // console.log(jwtParamObject, 'jwtParamObject');

      // console.log(query?.["pending2Fa"], "Hello query");

      // if (jwtParamObject.user) {
      //   let typeCastedUser =
      //     jwtParamObject.user as unknown as ITokenResponseModelWithAdditionalData;
      //   jwtParamObject.token.accessToken = typeCastedUser.tokenInfo.accessToken;
      //   jwtParamObject.token.accessTokenExpiry =
      //     typeCastedUser.tokenInfo.accessTokenExpiryTime;
      //   jwtParamObject.token.refreshToken =
      //     typeCastedUser.tokenInfo.refreshToken;
      //   jwtParamObject.token.user = {
      //     mobile: typeCastedUser.phoneNumber,
      //     deviceInfo: typeCastedUser.deviceInfo,
      //     type: typeCastedUser.userInfo?.type,
      //     enable2FA: typeCastedUser.enable2FA,
      //     isPending2FAVerification: typeCastedUser.isPending2FAVerification,
      //   };
      // }

      const typeCastedToken = jwtParamObject.token;

      // Debugging code
      // If accessTokenExpiry is 1 hour, we have to refresh token before 1 hours pass. (thus 30 seconds before 1 hour passes)
      // const shouldRefreshTime = Math.round(
      //   new Date(typeCastedToken.accessTokenExpiry).getTime() - 59.7 * 60 * 1000 - Date.now()
      // );
      // console.log(typeCastedToken, "typeCastedToken");

      // If the token is still valid, just return it.

      // If the call arrives after 23 hours have passed, we allow to refresh the token.
      return Promise.resolve(jwtParamObject.token);
    },

    session: async ({ session, token }: any) => {
      // console.log(session, 'callbacks session');
      // console.log(token, 'callbacks token');
      // Here we pass accessToken to the client to be used in authentication with your API
      console.log(token, "#token task");
      session.user = token.user; // no need to send deviceinfo and phone number to client, if necessary turn this on
      session.accessToken = token.accessToken;
      session.accessTokenExpiry = token.accessTokenExpiry;
      session.isPending2FAVerification = token.isPending2FAVerification;
      session.error = token.error;
      return Promise.resolve(session);
      // }
    },

    //#TODO: After successfully login , need to check if this user need 2FA or not// if need then redirect to 2FA page with phone number
    //otherwise redirect to dashboard

    async redirect({ url, baseUrl }) {
      //console.log(url, 'url', baseUrl, 'baseUrl', process.env.NEXT_PUBLIC_NEXTAUTH_URL, 'PUBLIC_NEXTAUTH_URL');
      let returnUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || baseUrl;
      // if (url === `${returnUrl}/${SocialLoginUrls.GoogleLogin}`) {
      //   return `${returnUrl}/${SocialLoginUrls.GoogleLogin}`;
      // } else if (url === `/${returnUrl}${SocialLoginUrls.FacebookLogin}`) {
      //   return `${returnUrl}/${SocialLoginUrls.FacebookLogin}`;
      // }
      return returnUrl;
    },
  };
};
export const options = (query?: URLSearchParams): NextAuthOptions => {
  console.log(query, "query");
  return {
    providers,
    callbacks: callbacks(query),
    pages: { signIn: "/sign-in", signOut: "/", error: "/sign-in" },
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    jwt: { maxAge: 60 * 60 * 24 * 30 }, //this is the default
  };
};
