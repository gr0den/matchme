package com.me.controllers;

import com.me.dto.request.profile.UserProfileRequestDto;
import com.me.dto.response.profile.UserProfileResponseDto;
import com.me.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserProfileController
{
    private final UserService userService;

    @PostMapping("/profile/create")
    public ResponseEntity<UserProfileResponseDto> createProfile(@AuthenticationPrincipal Long userId,
                                                                @Valid
                                                                @RequestBody
                                                                UserProfileRequestDto request)
    {
        UserProfileResponseDto userProfileResponseDto = userService.createProfile(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(userProfileResponseDto);
    }
}
