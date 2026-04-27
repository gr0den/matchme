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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<RegistrationResponseDto> register(@Valid @RequestBody RegistrationRequestDto dto)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
		                     .body(authService.register(dto));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto dto)
	{
		return ResponseEntity.status(HttpStatus.OK.).body(authService.)
	}
}
