package com.me.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.dto.response.chat.ChatMessageResponse;
import com.me.services.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController 
{
    private final ChatService chatService;

    @GetMapping("/{contactId}")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(@AuthenticationPrincipal Long currentUserId,
                                                                @PathVariable Long contactId) 
    {
        return ResponseEntity.ok(chatService.getChatHistory(currentUserId, contactId));
    }

    @PostMapping("/{contactId}")
    public ResponseEntity<ChatMessageResponse> sendMessage(@AuthenticationPrincipal Long currentUserId,
                                                           @PathVariable Long contactId,
                                                           @RequestBody Map<String, String> payload) 
    {
        String content = payload.get("content");
        ChatMessageResponse sentMessage = chatService.sendMessage(currentUserId, contactId, content);
        
        return ResponseEntity.ok(sentMessage);
    }
}
