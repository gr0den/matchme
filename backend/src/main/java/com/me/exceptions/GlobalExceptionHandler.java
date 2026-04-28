package com.me.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler
{
	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<Object> handleUserAlreadyExistsException(UserAlreadyExistsException e)
	{
		return ResponseEntity.status(HttpStatus.CONFLICT)
		                     .body(Map.of("error", e.getMessage()));
	}

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException e)
	{
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
		                     .body(Map.of("error", e.getMessage()));
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<Object> handleInvalidCredentialsException(InvalidCredentialsException e)
	{
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                     .body(Map.of("error", e.getMessage()));
	}

}
