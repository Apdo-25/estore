import { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

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

const mapSessionToUser = (sessionUser: any): User => {
  return {
    id: sessionUser.id || '', // Assume there's an id in session user, adjust if different
    email: sessionUser.email,
    firstName: sessionUser.firstName || '',
    lastName: sessionUser.lastName|| '',
    role: 'user' // Assume a default role, adjust if you have roles in session
  };
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(session?.user ? mapSessionToUser(session.user) : null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser(mapSessionToUser(session.user));
    }
  }, [session]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    logout: () => {
      signOut();
      setUser(null);
      router.push('/login');
    },
    login: async (email, password) => {
      const response = await signIn('credentials', { redirect: false, email, password });
      if (!response.ok) {
        throw new Error('Login failed');
      }
    },
    register: async (data) => {
      try {
        const response = await fetch('/api/users/register', { // Make sure this matches your signup API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const returnedData = await response.json();
  
        if (response.status !== 201) {
          throw new Error(returnedData.message || 'Error during registration');
        }
  
        // Assuming the user should be automatically logged in after registration
        // This part might vary depending on how you handle sessions after registration
        await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });
  
        // setUser(returnedData.user); No need to set the user here if signIn will create the session and useEffect will catch it
  
        router.push('/profile'); // or wherever you want to redirect the user after registration
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
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
