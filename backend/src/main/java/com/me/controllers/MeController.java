package com.me.controllers;

import com.me.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MeController
{
    private final ProfileService profileService;
}
