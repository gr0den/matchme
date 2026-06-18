import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType 
{
    currentUserId: number | null;
    setCurrentUserId: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => 
{
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    return (
        <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => 
{
    const context = useContext(AuthContext);
    if (context === undefined) 
    {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};