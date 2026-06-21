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
        UserResponse userResponse = profileService.getUser(userId, userId);

        return ResponseEntity.ok()
                             .body(userResponse);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMeProfile(@AuthenticationPrincipal Long userId)
    {
        UserProfileResponse meProfileResponse = profileService.getUserProfile(userId, userId);

        return ResponseEntity.ok()
                             .body(meProfileResponse);
    }

    @GetMapping("/me/bio")
    public ResponseEntity<UserBioResponse> getMeBio(@AuthenticationPrincipal Long userId)
    {
        UserBioResponse userBioResponse = profileService.getUserBio(userId, userId);

        return ResponseEntity.ok()
                             .body(userBioResponse);
    }

    @GetMapping("/users/{targetUserId}")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal Long currentUserId,
                                                @PathVariable Long targetUserId)
    {
        UserResponse userResponse = profileService.getUser(currentUserId, targetUserId);

        return ResponseEntity.ok()
                             .body(userResponse);
    }

    @GetMapping("/users/{targetUserId}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal Long currentUserId,
                                                              @PathVariable Long targetUserId)
    {
        UserProfileResponse meProfileResponse = profileService.getUserProfile(currentUserId, targetUserId);

        return ResponseEntity.ok()
                             .body(meProfileResponse);
    }

    @GetMapping("/users/{targetUserId}/bio")
    public ResponseEntity<UserBioResponse> getUserBio(@AuthenticationPrincipal Long currentUserId,
                                                      @PathVariable Long targetUserId)
    {
        UserBioResponse userBioResponse = profileService.getUserBio(currentUserId, targetUserId);

        return ResponseEntity.ok()
                             .body(userBioResponse);
    }
}
