package com.me.dto.requests.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest
{
	private String token;
}
