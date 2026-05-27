package com.me.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto
{
	@NotBlank(message = "Email field cannot be blank")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Password field cannot be blank")
	private String password;
}
