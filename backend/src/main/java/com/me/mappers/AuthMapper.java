package com.me.mappers;

import com.me.dto.requests.auth.RegistrationRequest;
import com.me.dto.response.auth.LoginResponse;
import com.me.dto.response.auth.LogoutResponse;
import com.me.dto.response.auth.RegistrationResponse;
import com.me.entities.User;

public class AuthMapper
{
    public static User toUser(RegistrationRequest dto)
    {
        return new User().setEmail(dto.getEmail())
                         .setPassword(dto.getPassword());
    }

    public static RegistrationResponse toRegistrationResponseDto(User user, String token)
    {
        return new RegistrationResponse().setId(user.getId())
                                         .setEmail(user.getEmail())
                                         .setToken(token);
    }

    public static LoginResponse toLoginResponseDto(User user, String token)
    {
        return new LoginResponse().setId(user.getId())
                                  .setEmail(user.getEmail())
                                  .setToken(token);
    }

    public static LogoutResponse toLogoutResponseDto(String message)
    {
        return new LogoutResponse().setMessage(message);
    }
}
