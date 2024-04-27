import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const client_id = process.env.EXPO_PUBLIC_WWIZ_OAUTH_GITHUB_CLIENT_ID ?? "";
if (client_id === "") {
    throw new Error("Missing WWIZ_OAUTH_GITHUB_CLIENT_ID");
}

const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${client_id}`,
};

export const useGitHubOAuth = () => {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: client_id,
            scopes: ["identity"],
            redirectUri: makeRedirectUri({
                scheme: "wwiz",
            }),
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            console.log(code);
        }
    }, [response]);

    return { request, promptAsync };
};
