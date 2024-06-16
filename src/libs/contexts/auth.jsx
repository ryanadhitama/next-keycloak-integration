import keycloak from "@/libs/pkg/keycloak";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setAuth] = useState(null);
  const [token, setToken] = useState(null);
  const isRun = useRef(false);

  const getUserInfo = async (token) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data = await res.json();
      setUser(data);
      setAuth(true);
    } else {
      login();
    }
  };

  const login = async () => {
    if (isRun.current) return;
    isRun.current = true;
    keycloak
      .init({
        onLoad: "login-required",
      })
      .then((res) => {
        setAuth(res);
        setCookie("access_token", keycloak?.token);
        getUserInfo(keycloak?.token)
      });
  };

  const logout = useCallback(async () => {
    keycloak.logout;
    deleteCookie('access_token');
    window.location.href =
      process.env.NEXT_PUBLIC_KEYCLOAK_URL +
      `/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout?post_logout_redirect_uri=${window.location.origin}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT}`;
  }, []);

  useEffect(() => {
    if (!getCookie("access_token")) {
      login();
    } else {
      setToken(getCookie("access_token"));
      getUserInfo(getCookie("access_token"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
