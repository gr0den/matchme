package com.me.services;

import com.me.dto.request.profile.UserProfileRequestDto;
import com.me.dto.response.profile.UserProfileResponseDto;
import com.me.repositories.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService
{
    private final ProfileRepository profileRepository;


    @Transactional
    public UserProfileResponseDto createProfile(UserProfileRequestDto request)
    {
        return new UserProfileResponseDto();
    }
}
