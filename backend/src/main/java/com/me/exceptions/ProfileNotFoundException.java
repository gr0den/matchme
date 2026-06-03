package com.me.exceptions;

public class ProfileNotFoundException extends RuntimeException
{
    private static final String DEFAULT_MESSAGE = "Profile is not found";

    public ProfileNotFoundException()
    {
        super(DEFAULT_MESSAGE);
    }
}
