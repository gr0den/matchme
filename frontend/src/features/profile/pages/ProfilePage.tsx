import { useState, useEffect } from 'react'
import CardFlow from "./CardFlowPage"
import UpdateProfilePage from "./UpdateProfilePage"
import { getOnboarded } from '../api/profileApi'
import NavBar from '../../../shared/components/ui/navbar/navbar'
import "../styles/ProfilePage.css"

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
        return <p className="profile-status">Loading...</p>
    }

    if (error) {
        return <p className="profile-status profile-error">{error}</p>
    }

    return (
        <>
            <NavBar />

            <main className="profile-page">
                <div className="profile-view-toggle">
                    <button
                        type="button"
                        className={view === 'cardFlow' ? "active" : ""}
                        onClick={() => setView('cardFlow')}
                    >
                        Card Flow
                    </button>
                    <button
                        type="button"
                        className={view === 'updateProfile' ? "active" : ""}
                        onClick={() => setView('updateProfile')}
                    >
                        Update Page
                    </button>
                </div>

                {view === 'cardFlow' && (
                    <CardFlow onSubmitSuccess={() => setView("updateProfile")} />)}
                {view === 'updateProfile' && <UpdateProfilePage />}
            </main>
        </>
    )
}
