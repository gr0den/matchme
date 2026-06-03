package com.me.dto.response.profile;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class UpdateProfileResponse
{
    private Long userId;

    private String message;
}
