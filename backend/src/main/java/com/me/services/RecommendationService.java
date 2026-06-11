package com.me.services;

import com.me.entities.Profile;
import com.me.exceptions.ProfileNotFoundException;
import com.me.repositories.ProfileRepository;
import com.me.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService
{
    UserRepository userRepository;
    ProfileRepository profileRepository;

    public List<Long> getRecommendations(Long userId)
    {
        Profile profile = profileRepository.findById(userId)
                                           .orElseThrow(() -> new ProfileNotFoundException());

        double longitude = profile.getLocation()
                                  .getX();
        double latitude = profile.getLocation()
                                 .getY();

        List<Long> recommendations = profileRepository.findRecommendationsByLocation(longitude, latitude, profile.getSearchRadius(), userId);

        return recommendations;
    }
}
