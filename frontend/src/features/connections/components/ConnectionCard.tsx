import type { ConnectionCardProps } from "../types/connectionTypes"
import defaultAvatar from "../../../shared/assets/default-avatar.png"

export default function ConnectionCard({
    user,
    mode,
    busyAction,
    isAboutOpen,
    onToggleAbout,
    onAccept,
    onReject,
    onChat,
    onDisconnect,
}: ConnectionCardProps) {
    const isBusy = busyAction !== null

    return (
        <article className="connection-row">
            <div className="connection-person">
                <img
                    className="connection-avatar"
                    src={user.pictureUrl || defaultAvatar}
                    alt={`${user.userName}'s profile`}
                />

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
                            onClick={onChat}
                            disabled={isBusy}
                        >
                            Chat
                        </button>

                        <button
                            className="connection-secondary-button"
                            type="button"
                            onClick={onDisconnect}
                            disabled={isBusy}
                        >
                            {busyAction === "disconnect" ? "Disconnecting..." : "Disconnect"}
                        </button>
                    </>
                )}
            </div>
        </article>
    )
}
