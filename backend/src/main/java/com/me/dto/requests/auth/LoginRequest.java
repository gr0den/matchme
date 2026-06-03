package com.me.dto.requests.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest
{
	@NotBlank(message = "Email field cannot be blank")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Password field cannot be blank")
	@Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
	private String password;
}
