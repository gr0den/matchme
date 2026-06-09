package com.me.services;

import com.me.entities.Profile;
import com.me.exceptions.ProfileNotFoundException;
import com.me.repositories.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService
{
    ProfileRepository profileRepository;

    public List<Long> getRecommendations(Long userId)
    {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new ProfileNotFoundException());

        return new ArrayList<>();
    }
}
