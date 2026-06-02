package com.me.services;

import com.me.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService
{
    @Value("${app.jwt.secretKeyBase}")
    private String keyBase;

    @Value("${app.jwt.expirationTime}")
    private long expirationTime;


    public String generateToken(User user)
    {
        Date expiresAt = new Date(System.currentTimeMillis() + expirationTime);

        return Jwts.builder()
                   .subject(user.getEmail())
                   .claim("id", user.getId())
                   .issuedAt(new Date())
                   .expiration(expiresAt)
                   .signWith(getSecretKey())
                   .compact();
    }

    public Long getUserId(String token)
    {
        Claims claims = Jwts.parser()
                            .verifyWith(getSecretKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

        return claims.get("id", Long.class);
    }

    public ResponseCookie generateJwtCookie(String token)
    {
        return ResponseCookie.from("jwtCookie", token)
                             .httpOnly(true)
                             .path("/")
                             .maxAge(expirationTime / 1000)
                             .build();
    }

    public boolean isTokenValid(String token)
    {
        try
        {
            Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token);

            return true;

        } catch (Exception e)
        {
            return false;
        }
    }

    public Date getExpirationDate(String token)
    {
        Claims claims = Jwts.parser()
                            .verifyWith(getSecretKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

        return claims.getExpiration();
    }

    private SecretKey getSecretKey()
    {
        return Keys.hmacShaKeyFor(keyBase.getBytes());
    }
}
