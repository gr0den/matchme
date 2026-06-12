package com.me.controllers;

import com.me.dto.response.user.UserBioResponse;
import com.me.dto.response.user.UserProfileResponse;
import com.me.dto.response.user.UserResponse;
import com.me.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        return getUser(userId);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMeProfile(@AuthenticationPrincipal Long userId)
    {
        return getUserProfile(userId);
    }

    @GetMapping("me/bio")
    public ResponseEntity<UserBioResponse> getMeBio(@AuthenticationPrincipal Long userId)
    {
        return getUserBio(userId);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id)
    {
        UserResponse userResponse = profileService.getUser(id);

        return ResponseEntity.ok()
                             .body(userResponse);
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id)
    {
        UserProfileResponse meProfileResponse = profileService.getUserProfile(id);

        return ResponseEntity.ok()
                             .body(meProfileResponse);
    }

    @GetMapping("/users/{id}/bio")
    public ResponseEntity<UserBioResponse> getUserBio(@PathVariable Long id)
    {
        UserBioResponse userBioResponse = profileService.getUserBio(id);

        return ResponseEntity.ok()
                             .body(userBioResponse);
    }
}
