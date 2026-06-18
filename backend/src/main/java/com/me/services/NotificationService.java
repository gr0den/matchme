package com.me.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import com.me.dto.response.connection.NotificationResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService 
{

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUser(Long userId, NotificationResponse response) 
    {
        String destination = "/topic/notifications/" + userId;

        messagingTemplate.convertAndSend(destination, response);
    }
}