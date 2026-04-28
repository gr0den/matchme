package com.me.services;

import com.me.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService
{
	private final String keyBase = "46K!pzdO9IXCfaGS4m$GxyEqFKXLe1lzW4r3pCzD3%xNtQI67COwiXBiNNfaJke!";
	private final long expirationTime = 86400000;

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

	private SecretKey getSecretKey()
	{
		return Keys.hmacShaKeyFor(keyBase.getBytes());
	}
}
