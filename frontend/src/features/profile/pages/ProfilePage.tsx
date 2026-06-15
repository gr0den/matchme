import { useState, useEffect } from 'react'
import CardFlow from "./CardFlowPage"
import UpdateProfilePage from "./UpdateProfilePage"
import { getOnboarded } from '../api/profileApi'

export default function ProfilePage() {
    const [view, setView] = useState<'cardFlow' | 'updateProfile'>('cardFlow')
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOnboarded() {
            try {
                setIsLoading(true);

                const isOnboarded = await getOnboarded()

                if (isOnboarded) {
                    setView('updateProfile')
                } else {
                    setView('cardFlow')
                }

            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load profile."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadOnboarded();
    }, []);

    if (isLoading) {
    return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <>



            <button onClick={() => setView('cardFlow')}>Card Flow</button>
            <button onClick={() => setView('updateProfile')}>Update Page</button>
            
            {view === 'cardFlow' && <CardFlow />}
            {view === 'updateProfile' && <UpdateProfilePage />}
        </>
    )
}