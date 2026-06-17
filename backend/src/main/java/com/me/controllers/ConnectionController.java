package com.me.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.dto.requests.connection.ConnectionRequest;
import com.me.services.ConnectionService;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/connections")
public class ConnectionController
{
    private final ConnectionService connectionService;

    @PostMapping("/request")
    public ResponseEntity<String> sendConnectionRequest(@Valid @RequestBody ConnectionRequest request) 
    {
        
        connectionService.requestConnection(request);

        return ResponseEntity.ok("Connection request sent and user notified.");
    }
}
