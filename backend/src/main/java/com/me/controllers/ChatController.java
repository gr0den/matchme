package com.me.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.me.dto.requests.chat.ChatMessageRequest;
import com.me.dto.response.chat.ChatHistoryResponse;
import com.me.dto.response.chat.ChatMessageResponse;
import com.me.dto.response.chat.ChatSummaryResponse;
import com.me.services.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController
{
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatSummaryResponse>> getChats(@AuthenticationPrincipal Long currentUserId)
    {
        return ResponseEntity.ok(chatService.getChatSummaries(currentUserId));
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<ChatHistoryResponse> getHistory(@AuthenticationPrincipal Long currentUserId,
                                                          @PathVariable Long contactId,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "30") int size)
    {
        return ResponseEntity.ok(chatService.getChatHistory(currentUserId, contactId, page, size));
    }

    @PostMapping("/{contactId}")
    public ResponseEntity<ChatMessageResponse> sendMessage(@AuthenticationPrincipal Long currentUserId,
                                                           @PathVariable Long contactId,
                                                           @Valid @RequestBody ChatMessageRequest request)
    {
        ChatMessageResponse sentMessage = chatService.sendMessage(currentUserId, contactId, request);

        return ResponseEntity.ok(sentMessage);
    }

    @PatchMapping("/{contactId}/read")
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal Long currentUserId,
                                         @PathVariable Long contactId)
    {
        chatService.markChatRead(currentUserId, contactId);

        return ResponseEntity.ok().build();
    }
}
