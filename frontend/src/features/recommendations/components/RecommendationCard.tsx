import type { RecommendationCardProps } from "../types/recommendationTypes";

export default function RecommendationCard({ user, onAccept, onReject }: RecommendationCardProps) {
    return (
        <article>
            {user.pictureUrl && (
                <img src="{user.pictureUrl} alt={`${user.userName}'s profile`}"/>
            )}

            <h2>{user.userName}</h2>

            <section>
                <h3>Interests</h3>
                {user.interests.map((interest) => (
                    <span key={interest.id}>{interest.interest}</span>
                ))}
            </section>

            <section>
                <h3>Genres</h3>
                {user.genres.map((genre) => (
                    <span key={genre.id}>{genre.genre}</span>
                ))}
            </section>

            <section>
                <h3>Looking for</h3>
                {user.targetGenres.map((genre) => (
                    <span key={genre.id}>{genre.genre}</span>
                ))}
            </section>

            <div>
                <button type="button" onClick={onReject}>
                    Reject
                </button>

                <button type="button" onClick={onAccept}>
                    Accept
                </button>
            </div>
        </article>
    )
}