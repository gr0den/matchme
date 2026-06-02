package com.me.dto.response.profile;

import com.me.entities.Genre;
import com.me.entities.Interest;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
public class UserProfileResponseDto
{
    private Long userId;

    private String userName;

    private String bio;

    private Set<Interest> interests;

    private Set<Genre> genres;

    private Set<Genre> targetGenres;

    private Double latitude;

    private Double longitude;

    private String pictureUrl;
}
