package com.me.dto.response.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class RegistrationResponseDto
{
	private Long id;

	private String email;

    private String token;
}
