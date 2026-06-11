package com.me.dto.response.user;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class UserProfileResponse
{
    private Long id;

    private String bio;
}
