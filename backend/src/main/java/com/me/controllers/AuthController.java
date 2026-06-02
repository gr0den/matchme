package com.me.controllers;

import com.me.dto.request.auth.LoginRequestDto;
import com.me.dto.request.auth.LogoutRequestDto;
import com.me.dto.request.auth.RegistrationRequestDto;
import com.me.dto.response.auth.LoginResponseDto;
import com.me.dto.response.auth.LogoutResponseDto;
import com.me.dto.response.auth.RegistrationResponseDto;
import com.me.services.AuthService;
import com.me.services.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> register(@Valid @RequestBody RegistrationRequestDto request)
    {
        RegistrationResponseDto registrationResponseDto = authService.register(request);
        
        ResponseCookie jwtCookie = jwtService.generateJwtCookie(registrationResponseDto.getToken());

        registrationResponseDto.setToken(null);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(registrationResponseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request)
    {
        LoginResponseDto loginResponseDto = authService.login(request);

        ResponseCookie jwtCookie = jwtService.generateJwtCookie(loginResponseDto.getToken());

        loginResponseDto.setToken(null);

        return ResponseEntity.ok()
                             .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                             .body(loginResponseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDto> logout(@Valid @RequestBody LogoutRequestDto request)
    {
        return ResponseEntity.ok()
                             .body(authService.logout(request));
    }
}
