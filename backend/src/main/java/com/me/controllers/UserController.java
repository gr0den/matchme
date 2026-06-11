package com.me.controllers;

import com.me.dto.response.user.UserBioResponse;
import com.me.dto.response.user.UserProfileResponse;
import com.me.dto.response.user.UserResponse;
import com.me.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController
{
    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal Long userId)
    {
        UserResponse meResponse = profileService.getMe(userId);

        return ResponseEntity.ok()
                             .body(meResponse);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMeProfile(@AuthenticationPrincipal Long userId)
    {
        UserProfileResponse meProfileResponse = profileService.getMeProfile(userId);

        return ResponseEntity.ok()
                             .body(meProfileResponse);
    }

    @GetMapping("me/bio")
    public ResponseEntity<UserBioResponse> getMeBio(@AuthenticationPrincipal Long userId)
    {
        UserBioResponse userBioResponse = profileService.getMeBio(userId);

        return ResponseEntity.ok()
                             .body(userBioResponse);
    }
}
