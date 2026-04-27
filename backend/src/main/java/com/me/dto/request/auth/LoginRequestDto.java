package com.me.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto
{
	@NotBlank(message = "Please enter your email address")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Please enter your password")
	private String password;
}
