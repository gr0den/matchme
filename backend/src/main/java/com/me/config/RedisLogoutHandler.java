package com.me.config;

import com.me.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisLogoutHandler implements LogoutHandler
{
    private final JwtService jwtService;
    private final StringRedisTemplate redis;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
    {
        if (request.getCookies() == null) return;

        String token = Arrays.stream(request.getCookies())
                             .filter(cookie -> cookie.getName().equals("jwtCookie"))
                             .map(Cookie::getValue)
                             .findFirst()
                             .orElse(null);

        if (token != null && jwtService.isTokenValid(token) && !Boolean.TRUE.equals(token))
        {
            long tokenLeftTime = jwtService.getExpirationDate(token).getTime() - System.currentTimeMillis();

            if (tokenLeftTime > 0)
            {
                redis.opsForValue().set(token, "blacklisted", tokenLeftTime, TimeUnit.MILLISECONDS);
            }
        }

    }
}
