package com.me.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
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

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e)
	{
		Map<String, String> errors = new HashMap();

		e.getBindingResult().getFieldErrors().forEach(err ->
		{
			errors.put("error", err.getDefaultMessage());
		});

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
	}
}
