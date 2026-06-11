package com.me.controllers;

import com.me.dto.requests.profile.CreateProfileRequest;
import com.me.dto.requests.profile.UpdateProfileRequest;
import com.me.dto.response.profile.CreateProfileResponse;
import com.me.dto.response.profile.UpdateProfileResponse;
import com.me.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class ProfileController
{
    private final ProfileService profileService;

    @PostMapping("/profile/create")
    public ResponseEntity<CreateProfileResponse> createProfile(@AuthenticationPrincipal Long userId,
                                                               @Valid
                                                               @RequestBody
                                                               CreateProfileRequest request)
    {
        CreateProfileResponse createProfileResponse = profileService.createProfile(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(createProfileResponse);
    }

    @PatchMapping("/profile/update")
    public ResponseEntity<UpdateProfileResponse> updateProfile(@AuthenticationPrincipal Long userId,
                                                               @Valid
                                                               @RequestBody
                                                               UpdateProfileRequest request)
    {
        UpdateProfileResponse updateProfileResponse = profileService.updateProfile(request, userId);

        return ResponseEntity.ok()
                             .body(updateProfileResponse);
    }

    @GetMapping("/onboarded")
    public ResponseEntity<Map<String, Boolean>> isOnboarded(@AuthenticationPrincipal Long userId)
    {
        boolean isOnboarded = profileService.isOnboarded(userId);

        return ResponseEntity.ok()
                             .body(Map.of("onboarded", isOnboarded));
    }
}
