package com.me.mappers;

import com.me.dto.response.profile.CreateProfileResponse;
import com.me.dto.response.profile.UpdateProfileResponse;
import com.me.entities.Profile;

public class ProfileMapper
{
    public static CreateProfileResponse toCreateProfileResponse(Profile userProfile)
    {
        return new CreateProfileResponse().setUserId(userProfile.getId())
                                          .setMessage("User profile was successfully created");
    }

    public static UpdateProfileResponse toUpdateProfileResponse(Profile profile)
    {
        return new UpdateProfileResponse().setUserId(profile.getId())
                                          .setMessage("User profile was successfully updated");
    }
}
