import type { ConnectionCardProps } from "../types/connectionTypes"

export default function ConnectionCard({
    user,
    mode,
    busyAction,
    isAboutOpen,
    onToggleAbout,
    onAccept,
    onReject,
}: ConnectionCardProps) {
    const isBusy = busyAction !== null

    return (
        <article className="connection-row">
            <div className="connection-person">
                {user.pictureUrl ? (
                    <img
                        className="connection-avatar"
                        src={user.pictureUrl}
                        alt={`${user.userName}'s profile`}
                    />
                ) : (
                    <div
                        className="connection-avatar connection-avatar-placeholder"
                        aria-hidden="true"
                    />
                )}

                <div className="connection-copy">
                    <h2>{user.userName}</h2>

                    <button
                        className="connection-about-button"
                        type="button"
                        onClick={onToggleAbout}
                        aria-expanded={isAboutOpen}
                    >
                        About
                    </button>

                    {isAboutOpen && (
                        <p className="connection-about">
                            {user.bio || "No bio yet."}
                        </p>
                    )}
                </div>
            </div>

            <div className="connection-actions">
                {mode === "request" ? (
                    <>
                        <button
                            className="connection-primary-button"
                            type="button"
                            onClick={onAccept}
                            disabled={isBusy}
                        >
                            {busyAction === "accept" ? "Accepting..." : "Accept"}
                        </button>

                        <button
                            className="connection-secondary-button"
                            type="button"
                            onClick={onReject}
                            disabled={isBusy}
                        >
                            {busyAction === "reject" ? "Rejecting..." : "Reject"}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="connection-primary-button"
                            type="button"
                            disabled
                        >
                            Chat
                        </button>

                        <button
                            className="connection-secondary-button"
                            type="button"
                            disabled
                        >
                            Disconnect
                        </button>
                    </>
                )}
            </div>
        </article>
    )
}
