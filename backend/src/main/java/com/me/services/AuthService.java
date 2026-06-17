package com.me.services;

import com.me.dto.requests.auth.LoginRequest;
import com.me.dto.requests.auth.RegistrationRequest;
import com.me.dto.response.auth.LoginResponse;
import com.me.dto.response.auth.RegistrationResponse;
import com.me.entities.User;
import com.me.exceptions.InvalidCredentialsException;
import com.me.exceptions.UserAlreadyExistsException;
import com.me.exceptions.UserNotFoundException;
import com.me.mappers.AuthMapper;
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
    public RegistrationResponse register(RegistrationRequest request)
    {
        boolean isExist = authRepository.existsByEmail(request.getEmail());

        if (isExist)
        {
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = AuthMapper.toUser(request);

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        user.setPassword(encodedPassword);

        User savedUser = authRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return AuthMapper.toRegistrationResponseDto(savedUser, token);
    }

    public LoginResponse login(LoginRequest request)
    {
        User user = authRepository.findByEmail(request.getEmail())
                                  .orElseThrow(() -> new UserNotFoundException());

        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!isPasswordMatch) throw new InvalidCredentialsException("Invalid credentials");

        String token = jwtService.generateToken(user);

        return AuthMapper.toLoginResponseDto(user, token);
    }
}
