package com.me.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.dto.requests.connection.ConnectionRequest;
import com.me.dto.response.connection.NotificationResponse;
import com.me.dto.response.connection.UserConnectionsResponse;
import com.me.services.ConnectionService;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/connections")
public class ConnectionController
{
    private final ConnectionService connectionService;

    @PostMapping("/connect")
    public ResponseEntity<NotificationResponse> sendConnectionRequest(@Valid @RequestBody ConnectionRequest request) 
    {
        
        NotificationResponse response = connectionService.requestConnection(request);

        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/accept")
    public ResponseEntity<Void> acceptConnectionRequest(@RequestBody ConnectionRequest request) 
    {
        connectionService.acceptUser(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reject")
    public ResponseEntity<Void> rejectRecommendation(@RequestBody ConnectionRequest request) 
    {
        connectionService.rejectUser(request);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<UserConnectionsResponse> getConnections(@AuthenticationPrincipal Long userId) 
    {
        return ResponseEntity.ok(connectionService.getUserConnections(userId));
    }
}
