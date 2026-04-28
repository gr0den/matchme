package com.me.services;

import com.me.dto.request.auth.LoginRequestDto;
import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.LoginResponseDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.entities.User;
import com.me.exceptions.InvalidCredentialsException;
import com.me.exceptions.UserAlreadyExistsException;
import com.me.exceptions.UserNotFoundException;
import com.me.mappers.UserMapper;
import com.me.repositories.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService
{
	private final AuthRepository authRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	@Transactional
	public RegistrationResponseDto register(RegistrationRequestDto request)
	{
		boolean isExist = authRepository.existsByEmail(request.getEmail());

		if (isExist)
		{
			throw new UserAlreadyExistsException("User already exists");
		}

		User user = UserMapper.toUser(request);

		String encodedPassword = passwordEncoder.encode(request.getPassword());

		user.setPassword(encodedPassword);

		User savedUser = authRepository.save(user);

		return UserMapper.toRegistrationResponseDto(savedUser);
	}

	public LoginResponseDto login(LoginRequestDto request)
	{
		User user = authRepository.findByEmail(request.getEmail())
		                          .orElseThrow(() -> new UserNotFoundException("User is not found"));

		boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());

		if (!isPasswordMatch) throw new InvalidCredentialsException("Invalid credentials");

		String token = jwtService.generateToken(user);

		return UserMapper.toLoginResponseDto(user, token);
	}
}
