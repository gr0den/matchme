package com.me.dto.request.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
public class LogoutRequestDto
{
	private String token;
}
