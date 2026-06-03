package com.me.dto.response.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class LogoutResponse
{
	private String message;
}
