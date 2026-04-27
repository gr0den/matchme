package com.me.mappers;

import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.entities.User;

public class UserMapper
{
	public static User toUser(RegistrationRequestDto dto)
	{
		return new User().setEmail(dto.getEmail())
		                 .setPassword(dto.getPassword());
	}

	public static RegistrationResponseDto toDto(User user)
	{
		return new RegistrationResponseDto().setId(user.getId())
		                                    .setEmail(user.getEmail());
	}
}
