package com.me.services;

import com.me.dto.request.auth.LoginRequestDto;
import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.LoginResponseDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.entities.User;
import com.me.exceptions.UserAlreadyExistsException;
import com.me.mappers.UserMapper;
import com.me.repositories.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService
{
	private final AuthRepository authRepository;

	@Transactional
	public RegistrationResponseDto register(RegistrationRequestDto dto)
	{
		boolean isExist = authRepository.existsByEmail(dto.getEmail());

		if (isExist)
		{
			throw new UserAlreadyExistsException("Such user already exists");
		}

		User user = authRepository.save(UserMapper.toUser(dto));

		return UserMapper.toDto(user);
	}

	@Transactional
	public LoginResponseDto login(LoginRequestDto dto)
	{
		authRepository.findByEmail(dto.getEmail())
		              .orElseThrow()
	}
}
