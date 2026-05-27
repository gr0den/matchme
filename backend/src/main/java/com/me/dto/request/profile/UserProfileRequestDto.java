package com.me.dto.request.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
public class UserProfileRequestDto
{
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 1, max = 64, message = "Username must be between 1 and 64 characters")
    private String userName;

    @Size(max = 500, message = "Biography cannot exceed 500 characters length")
    private String bio;

    @NotEmpty(message = "Interests set cannot be empty")
    @Size(min = 5, max = 10, message = "Amount of selected interests must be between 5 and 10")
    private Set<Long> interestIds;
}
