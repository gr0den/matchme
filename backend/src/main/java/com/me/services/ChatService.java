package com.me.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.me.dto.requests.chat.ChatMessageRequest;
import com.me.dto.response.chat.ChatMessageResponse;
import com.me.entities.ChatMessage;
import com.me.entities.Connection;
import com.me.repositories.ChatMessageRepository;
import com.me.repositories.ConnectionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService 
{
    private final ChatMessageRepository chatMessageRepository;
    private final ConnectionRepository connectionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessageResponse sendMessage(ChatMessageRequest request) 
    {
        Long senderId = request.getSenderId();
        Long receiverId = request.getReceiverId();
        String content = request.getContent();

    
        boolean isConnected = connectionRepository.findByUserIdAndConnectionId(senderId, receiverId)
            .or(() -> connectionRepository.findByUserIdAndConnectionId(receiverId, senderId))
            .map(Connection::getStatus)
            .filter(status -> status.equals("CONNECTED"))
            .isPresent();

        if (!isConnected) 
        {
            throw new RuntimeException("Cannot send message: Users are not connected.");
        }

        ChatMessage message = new ChatMessage();

        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
            
        ChatMessage savedMessage = chatMessageRepository.save(message);

        ChatMessageResponse response = new ChatMessageResponse()
                                                                .setId(savedMessage.getId())
                                                                .setSenderId(savedMessage.getSenderId())
                                                                .setReceiverId(savedMessage.getReceiverId())
                                                                .setContent(savedMessage.getContent())
                                                                .setTimestamp(savedMessage.getTimestamp());

        messagingTemplate.convertAndSend("/topic/chat/" + receiverId, response);

        return response;
    }

    public List<ChatMessageResponse> getChatHistory(Long currentUserId, Long contactId) 
    {
        return chatMessageRepository.findChatHistory(currentUserId, contactId)
            .stream()
            .map(msg -> new ChatMessageResponse()
                .setId(msg.getId())
                .setSenderId(msg.getSenderId())
                .setReceiverId(msg.getReceiverId())
                .setContent(msg.getContent())
                .setTimestamp(msg.getTimestamp()))
            .toList();
    }
}
