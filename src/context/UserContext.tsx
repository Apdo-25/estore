import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookie() {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        console.error('Error fetching user:', await response.text());
      }
    }
    loadUserFromCookie();
  }, []);
  
  

  const contextValue = useMemo(() => ({
    user,
    setUser,
    logout: () => {
      sessionStorage.removeItem('userToken');
      setUser(null);
      router.push('/login');
    },
    login: async (email, password) => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.status !== 200) throw new Error(data.error);

        const decodedUserData = jwt.decode(data.token) as jwt.JwtPayload | string;

        if (
          typeof decodedUserData !== "string" && 
          decodedUserData && 
          'id' in decodedUserData && 
          'email' in decodedUserData && 
          'firstName' in decodedUserData && 
          'lastName' in decodedUserData
      ) {
          setUser(decodedUserData as unknown as User);
          sessionStorage.setItem('userToken', data.token);
      } else {
          console.error("JWT payload does not have required user fields or is a string.");
      }
        

      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    register: async (data) => {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const returnedData = await response.json();
        
        if (response.status !== 201) throw new Error(returnedData.error);

        setUser(returnedData.user);
        router.push('/login');
      } catch (error) {
        console.error("Error during registration:", error);
      }
    },
  }), [user, router]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
