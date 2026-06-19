package com.me.services;

import java.util.List;
import org.springframework.stereotype.Service;

import com.me.dto.requests.connection.ConnectionRequest;
import com.me.dto.response.connection.NotificationResponse;
import com.me.dto.response.connection.UserConnectionsResponse;
import com.me.entities.Connection;
import com.me.repositories.ConnectionRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ConnectionService 
{

    private final ConnectionRepository connectionRepository;  
    private final NotificationService notificationService;

    public NotificationResponse requestConnection(ConnectionRequest request) 
    {
        
        Connection newConnection = new Connection();

        newConnection.setUserId(request.getRequesterId());
        newConnection.setConnectionId(request.getTargetUserId());
        newConnection.setStatus("PENDING"); 
        
        connectionRepository.save(newConnection);

        NotificationResponse response = new NotificationResponse()
                                                                    .setType("CONNECTION_REQUEST")
                                                                    .setMessage("A new user wants to connect with you!")
                                                                    .setRequesterId(request.getRequesterId());

        notificationService.sendToUser(request.getTargetUserId(), response);

        return response;
    }

    public void dismissUser(ConnectionRequest request) 
    {
        
        boolean alreadyExists = connectionRepository.existsByUserIdAndConnectionId(
                request.getRequesterId(), 
                request.getTargetUserId()
            );

            if (alreadyExists) {
                return; 
            }

        Connection dismissedConnection = new Connection();

        dismissedConnection.setUserId(request.getRequesterId())
                           .setConnectionId(request.getTargetUserId())
                           .setStatus("DISMISSED");

        connectionRepository.save(dismissedConnection);
    }

    public void rejectUser(ConnectionRequest request) 
    {
        Connection existingConnection = connectionRepository.findByUserIdAndConnectionId
        (
            request.getTargetUserId(), 
            request.getRequesterId()
        ).orElseThrow(() -> new RuntimeException("Pending connection request not found"));

        existingConnection.setStatus("REJECTED"); 
        
        connectionRepository.save(existingConnection);
    }

    public void acceptUser(ConnectionRequest request) 
    {
        Connection existingConnection = connectionRepository.findByUserIdAndConnectionId(
            request.getTargetUserId(), 
            request.getRequesterId()   
        ).orElseThrow(() -> new RuntimeException("Pending connection request not found"));

        existingConnection.setStatus("CONNECTED"); 
        
        connectionRepository.save(existingConnection);

        NotificationResponse response = new NotificationResponse()
                                                                    .setType("CONNECTION_ACCEPTED")
                                                                    .setMessage("Your connection request was accepted!")
                                                                    .setRequesterId(request.getRequesterId());

        notificationService.sendToUser(request.getTargetUserId(), response);
    }

    public UserConnectionsResponse getUserConnections(Long userId) 
    {
        List<Long> pending = connectionRepository.findPendingIncomingRequests(userId);
        List<Long> active = connectionRepository.findActiveConnections(userId);

        return new UserConnectionsResponse()
                .setPendingConnections(pending)
                .setActiveConnections(active);
    }
}