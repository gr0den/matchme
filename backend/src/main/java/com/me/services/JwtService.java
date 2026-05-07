package com.me.services;

import com.me.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
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
		return Jwts.builder()
		           .subject(user.getEmail())
		           .claim("id", user.getId())
		           .issuedAt(new Date())
		           .expiration(new Date(System.currentTimeMillis() + expirationTime))
		           .signWith(getSecretKey())
		           .compact();
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

	private SecretKey getSecretKey()
	{
		return Keys.hmacShaKeyFor(keyBase.getBytes());
	}
}
