package com.me.dto.response.user;

import com.me.entities.Genre;
import com.me.entities.Interest;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
public class UserBioResponse
{
    private Long id;

    private Double longitude;

    private Double latitude;

    private Set<Interest> interests;

    private Set<Genre> genres;

    private Set<Genre> targetGenres;

    private Integer searchRadius;
}
