import Keycloak from "keycloak-js";

const keycloak =
  typeof document !== "undefined"
    ? new Keycloak({
        url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
        realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
        clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT,
      })
    : null;

export default keycloak;
