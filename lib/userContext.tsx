import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import {supabase} from "@/lib/supabase"

export interface UserProfile {
    username: string;
}

export interface UserInfo {
    session: Session | null;
    profile: UserProfile | null;
}

const UserContext = createContext<UserInfo>({
    session: null,
    profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        session: null,
        profile: null,
    });

    useEffect(() => {
        // Obtener la sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserInfo((prevState) => ({ ...prevState, session }));
        });

        // Manejar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserInfo({ session, profile: null });
        });

        // Limpiar la suscripción cuando el componente se desmonte
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserInfo() {
    return useContext(UserContext);
}