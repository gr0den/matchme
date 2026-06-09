package com.me.controllers;

import com.me.services.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RecommendationController
{
    private final RecommendationService recommendationService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<Long>> getRecommendations(@AuthenticationPrincipal Long userId)
    {
        return ResponseEntity.ok().body(recommendationService.getRecommendations(userId));
    }
}
