package com.me.services;

import org.springframework.stereotype.Service;

import com.me.dto.requests.connection.ConnectionRequest;
import com.me.dto.response.connection.NotificationResponse;
import com.me.entities.Connection;
import com.me.repositories.ConnectionRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ConnectionService 
{

    private final ConnectionRepository connectionRepository;  
    private final NotificationService notificationService;

    public void requestConnection(ConnectionRequest request) 
    {
        
        Connection newConnection = new Connection();

        newConnection.setUserId(request.getRequesterId());
        newConnection.setConnectionId(request.getTargetUserId());
        newConnection.setStatus("PENDING"); 
        
        connectionRepository.save(newConnection);

        NotificationResponse response = new NotificationResponse
        (
            "CONNECTION_REQUEST",
            "A new user wants to connect with you!"
        );
        
        notificationService.sendToUser(request.getTargetUserId(), response);
    }
}