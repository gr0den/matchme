package com.me.mappers;

import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.LoginResponseDto;
import com.me.dto.response.auth.LogoutResponseDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.entities.User;

public class UserMapper
{
	public static User toUser(RegistrationRequestDto dto)
	{
		return new User().setEmail(dto.getEmail())
		                 .setPassword(dto.getPassword());
	}

	public static RegistrationResponseDto toRegistrationResponseDto(User user, String token)
	{
		return new RegistrationResponseDto().setId(user.getId())
		                                    .setEmail(user.getEmail());
	}

	public static LoginResponseDto toLoginResponseDto(User user, String token)
	{
		return new LoginResponseDto().setId(user.getId())
		                             .setEmail(user.getEmail())
		                             .setToken(token);
	}

	public static LogoutResponseDto toLogoutResponseDto(String message)
	{
		return new LogoutResponseDto().setMessage(message);
	}
}
