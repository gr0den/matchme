package com.me.dto.response.user;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class UserResponse
{
    private Long id;

    private String userName;

    private String pictureUrl;
}
