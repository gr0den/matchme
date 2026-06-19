import type { RecommendationCardProps } from "../types/recommendationTypes";
import defaultAvatar from "../../../shared/assets/default-avatar.png"

export default function RecommendationCard({
    user,
    busyAction,
    isAboutOpen,
    onToggleAbout,
    onConnect,
    onDismiss,
}: RecommendationCardProps) {
    const isBusy = busyAction !== null

    return (
        <article className="recommendation-row">
            <div className="recommendation-person">
                <img
                    className="recommendation-avatar"
                    src={user.pictureUrl || defaultAvatar}
                    alt={`${user.userName}'s profile`}
                />

                <div className="recommendation-copy">
                    <h2>{user.userName}</h2>

                    <button
                        className="recommendation-about-button"
                        type="button"
                        onClick={onToggleAbout}
                        aria-expanded={isAboutOpen}
                    >
                        About
                    </button>

                    {isAboutOpen && (
                        <p className="recommendation-about">
                            {user.bio || "No bio yet."}
                        </p>
                    )}
                </div>
            </div>

            <div className="recommendation-actions">
                <button
                    className="recommendation-connect-button"
                    type="button"
                    onClick={onConnect}
                    disabled={isBusy}
                >
                    {busyAction === "connect" ? "Sending..." : "Connect"}
                </button>

                <button
                    className="recommendation-dismiss-button"
                    type="button"
                    onClick={onDismiss}
                    disabled={isBusy}
                >
                    {busyAction === "dismiss" ? "Dismissing..." : "Dismiss"}
                </button>
            </div>
        </article>
    )
}
