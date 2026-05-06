package com.me.controllers;

import com.me.dto.request.auth.LoginRequestDto;
import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.LoginResponseDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<RegistrationResponseDto> register(@Valid @RequestBody RegistrationRequestDto request)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
		                     .body(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request)
	{
		return ResponseEntity.status(HttpStatus.OK)
		                     .body(authService.login(request));
	}

	@PostMapping("/logout")
	public ResponseEntity<>
}
