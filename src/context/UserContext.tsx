import { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

// Adjust the Role type to be more specific if needed
type Role = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<string | undefined>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<string | undefined>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

const mapSessionToUser = (sessionUser: any): User => ({
  id: sessionUser.id || '',
  email: sessionUser.email,
  firstName: sessionUser.firstName || '',
  lastName: sessionUser.lastName || '',
  role: sessionUser.role || 'user' // Use the role from the session, with a fallback
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading
  const isAdmin = user?.role === 'admin';
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    setIsLoading(false);
    if (session?.user) {
      setUser(mapSessionToUser(session.user));
    } else {
      setUser(null);
    }
  }, [session, status]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    isLoading,
    isAdmin,
    logout: () => {
      signOut();
      setUser(null);
      router.push('/login');
    },
    login: async (email, password) => {
      setIsLoading(true);
      const response = await signIn('credentials', { redirect: false, email, password });
      setIsLoading(false);
      if (!response.ok) {
        return 'Login failed';
      }
    },
    register: async (data) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const returnedData = await response.json();
        setIsLoading(false);

        if (response.status !== 201) {
          return returnedData.message || 'Error during registration';
        }

        await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        router.push('/');
      } catch (error) {
        setIsLoading(false);
        console.error("Error during registration:", error);
        return 'Error during registration';
      }
    }
  }), [user, isAdmin, isLoading, router]);

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
