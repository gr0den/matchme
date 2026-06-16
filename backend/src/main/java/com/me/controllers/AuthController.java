package com.me.controllers;

import com.me.dto.requests.auth.LoginRequest;
import com.me.dto.requests.auth.RegistrationRequest;
import com.me.dto.response.auth.LoginResponse;
import com.me.dto.response.auth.RegistrationResponse;
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
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request)
    {
        RegistrationResponse registrationResponse = authService.register(request);

        ResponseCookie jwtCookie = jwtService.generateJwtCookie(registrationResponse.getToken());

        registrationResponse.setToken(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                             .body(registrationResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request)
    {
        LoginResponse loginResponse = authService.login(request);

        ResponseCookie jwtCookie = jwtService.generateJwtCookie(loginResponse.getToken());

        loginResponse.setToken(null);

        return ResponseEntity.ok()
                             .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                             .body(loginResponse);
    }
}
