package com.me.dto.requests.profile;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Range;

import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
public class UpdateProfileRequest
{
    @Size(min = 1, max = 64, message = "Username must be between 1 and 64 characters")
    private String userName;

    @Size(min = 50, max = 500, message = "Biography cannot be less then 50 or exceed 500 characters length")
    private String bio;

    @Size(min = 5, max = 10, message = "Amount of selected interests must be between 5 and 10")
    private Set<Long> interests;

    @Size(min = 1, max = 10, message = "Amount of selected genres must be between 1 and 10")
    private Set<Long> genres;

    @Size(min = 1, max = 10, message = "Amount of selected genres must be between 1 and 10")
    private Set<Long> targetGenres;

    @Range(min = -90, max = 90, message = "Invalid latitude")
    private Double latitude;

    @Range(min = -180, max = 180, message = "Invalid longitude")
    private Double longitude;

    private String pictureUrl;
}
