package com.me.mappers;

import com.me.dto.response.profile.UserProfileResponseDto;
import com.me.entities.Profile;

public class UserProfileMapper
{
    public static UserProfileResponseDto toUserProfileResponseDto(Profile userProfile)
    {
        return new UserProfileResponseDto().setUserId(userProfile.getId())
                                           .setMessage("User profile successfully created");
    }
}
