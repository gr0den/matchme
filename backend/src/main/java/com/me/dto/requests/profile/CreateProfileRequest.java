package com.me.dto.requests.profile;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Range;

import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
public class CreateProfileRequest
{
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 1, max = 64, message = "Username must be between 1 and 64 characters")
    private String userName;

    @Size(min = 50, max = 500, message = "Biography cannot be less then 50 or exceed 500 characters length")
    private String bio;

    @NotEmpty(message = "Interests set cannot be empty")
    @Size(min = 5, max = 10, message = "Amount of selected interests must be between 5 and 10")
    private Set<Long> interests;

    @NotEmpty(message = "Genres set cannot be empty")
    @Size(min = 1, max = 10, message = "Amount of selected genres must be between 1 and 10")
    private Set<Long> genres;

    @NotEmpty(message = "Target genres set cannot be empty")
    @Size(min = 1, max = 10, message = "Amount of selected genres must be between 1 and 10")
    private Set<Long> targetGenres;

    @NotNull(message = "Latitude is required")
    @Range(min = -90, max = 90, message = "Invalid latitude")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @Range(min = -180, max = 180, message = "Invalid longitude")
    private Double longitude;

    private String pictureUrl;
}
