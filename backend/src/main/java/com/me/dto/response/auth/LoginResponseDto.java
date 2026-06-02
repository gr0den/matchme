package com.me.dto.response.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class LoginResponseDto
{
	private Long id;

	private String token;

	private String email;
}
