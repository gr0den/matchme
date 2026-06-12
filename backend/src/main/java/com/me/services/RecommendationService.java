package com.me.services;

import com.me.entities.Genre;
import com.me.entities.Interest;
import com.me.entities.Profile;
import com.me.exceptions.ProfileNotFoundException;
import com.me.repositories.ProfileRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService
{
    private final ProfileRepository profileRepository;

    public List<Long> getRecommendations(Long userId)
    {
        Profile user = profileRepository.findById(userId)
                                        .orElseThrow(ProfileNotFoundException::new);

        double longitude = user.getLocation()
                               .getX();
        double latitude = user.getLocation()
                              .getY();

        List<Long> recommendedUsersIds = profileRepository.findRecommendationsByLocation(longitude,
                                                                                         latitude,
                                                                                         user.getSearchRadius(),
                                                                                         userId);
        double totalPoints = 0;

        Set<Genre> userGenres = user.getMyGenres();
        Set<Genre> userTargetGenres = user.getTargetGenres();
        Set<Interest> userInterests = user.getInterests();

        Set<Genre> candidateGenres;
        Set<Genre> candidateTargetGenres;
        Set<Interest> candidateInterests;

        List<CandidateProfile> candidates = new ArrayList<>();

        Set<Profile> profiles = new HashSet<>(profileRepository.findAllById(recommendedUsersIds));

        for (Profile candidate : profiles)
        {
            double userGenrePoints = 0;
            double userInterestPoints = 0;
            double sharedInterestPoints = 0;
            double candidateGenrePoints = 0;
            double candidateInterestPoints = 0;


            candidateGenres = candidate.getMyGenres();
            candidateTargetGenres = candidate.getTargetGenres();
            candidateInterests = candidate.getInterests();

            for (Genre candidateGenre : candidateGenres)
            {
                for (Genre userTargetGenre : userTargetGenres)
                {
                    if (candidateGenre.getId()
                                      .equals(userTargetGenre.getId()))
                    {
                        candidateGenrePoints = candidateGenrePoints + 3;
                    }
                }
            }

            if (candidateGenrePoints == 0) continue;

            for (Genre userGenre : userGenres)
            {
                for (Genre candidateGenre : candidateTargetGenres)
                {
                    if (userGenre.getId()
                                 .equals(candidateGenre.getId()))
                    {
                        userGenrePoints = userGenrePoints + 3;
                    }
                }
            }

            if (userGenrePoints == 0) continue;

            for (Interest userInterest : userInterests)
            {
                for (Interest candidateInterest : candidateInterests)
                {
                    if (userInterest.getId()
                                    .equals(candidateInterest.getId()))
                    {
                        sharedInterestPoints = sharedInterestPoints + 1;
                        break;
                    }
                }
            }

            candidateGenrePoints = candidateGenrePoints / userTargetGenres.size();
            userGenrePoints = userGenrePoints / candidateTargetGenres.size();
            userInterestPoints = sharedInterestPoints / userInterests.size();
            candidateInterestPoints = sharedInterestPoints / candidateInterests.size();

            totalPoints = candidateGenrePoints + userGenrePoints + userInterestPoints + candidateInterestPoints;

            CandidateProfile candidateProfile = new CandidateProfile(candidate,
                                                                     totalPoints);

            candidates.add(candidateProfile);
        }

        Collections.sort(candidates,
                         Collections.reverseOrder());

        return candidates.stream()
                         .limit(10)
                         .map((candidate) -> candidate.getProfile()
                                                      .getId())
                         .toList();
    }
}

@Getter
@Setter
@AllArgsConstructor
class CandidateProfile implements Comparable<CandidateProfile>
{
    private Profile profile;
    private double points;

    @Override
    public int compareTo(CandidateProfile o)
    {
        return Double.compare(this.getPoints(),
                              o.getPoints());
    }
}
