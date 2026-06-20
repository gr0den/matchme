package com.me.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.me.dto.requests.chat.ChatMessageRequest;
import com.me.dto.response.chat.ChatHistoryResponse;
import com.me.dto.response.chat.ChatMessageResponse;
import com.me.dto.response.chat.ChatSummaryResponse;
import com.me.entities.ChatMessage;
import com.me.entities.Connection;
import com.me.entities.Profile;
import com.me.exceptions.ProfileNotFoundException;
import com.me.repositories.ChatMessageRepository;
import com.me.repositories.ConnectionRepository;
import com.me.repositories.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService
{
    private static final int DEFAULT_PAGE_SIZE = 30;
    private static final int MAX_PAGE_SIZE = 100;

    private final ChatMessageRepository chatMessageRepository;
    private final ConnectionRepository connectionRepository;
    private final ProfileRepository profileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<ChatSummaryResponse> getChatSummaries(Long currentUserId)
    {
        return connectionRepository.findActiveConnections(currentUserId)
                                   .stream()
                                   .map(contactId -> buildSummary(currentUserId, contactId))
                                   .sorted(Comparator.comparing(ChatSummaryResponse::getLastMessageAt,
                                                               Comparator.nullsFirst(Comparator.naturalOrder()))
                                                     .reversed()
                                                     .thenComparing(ChatSummaryResponse::getContactName))
                                   .toList();
    }

    public ChatMessageResponse sendMessage(Long senderId, Long receiverId, ChatMessageRequest request)
    {
        ensureConnected(senderId, receiverId);

        ChatMessage message = new ChatMessage()
                .setSenderId(senderId)
                .setReceiverId(receiverId)
                .setContent(request.getContent());

        ChatMessage savedMessage = chatMessageRepository.save(message);
        ChatMessageResponse response = toResponse(savedMessage);

        messagingTemplate.convertAndSend("/topic/chat/" + receiverId, response);

        return response;
    }

    public ChatHistoryResponse getChatHistory(Long currentUserId, Long contactId, int page, int size)
    {
        ensureConnected(currentUserId, contactId);

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        Page<ChatMessage> historyPage = chatMessageRepository.findChatHistory(
                currentUserId,
                contactId,
                PageRequest.of(safePage, safeSize)
        );

        List<ChatMessage> newestFirst = historyPage.getContent();
        List<ChatMessage> displayOrder = new ArrayList<>(newestFirst);
        displayOrder.sort(Comparator.comparing(ChatMessage::getTimestamp).thenComparing(ChatMessage::getId));

        return new ChatHistoryResponse()
                .setMessages(displayOrder.stream().map(this::toResponse).toList())
                .setPage(safePage)
                .setSize(safeSize)
                .setHasMore(historyPage.hasNext());
    }

    @Transactional
    public void markChatRead(Long currentUserId, Long contactId)
    {
        ensureConnected(currentUserId, contactId);
        chatMessageRepository.markMessagesRead(currentUserId, contactId, LocalDateTime.now());
    }

    private ChatSummaryResponse buildSummary(Long currentUserId, Long contactId)
    {
        Profile contactProfile = profileRepository.findById(contactId)
                                                  .orElseThrow(() -> new ProfileNotFoundException());

        ChatMessage latestMessage = chatMessageRepository.findLatestMessage(
                currentUserId,
                contactId,
                PageRequest.of(0, 1)
        ).stream().findFirst().orElse(null);

        ChatSummaryResponse summary = new ChatSummaryResponse()
                .setContactId(contactId)
                .setContactName(contactProfile.getUsername())
                .setContactPictureUrl(contactProfile.getPictureUrl())
                .setUnreadCount(chatMessageRepository.countBySenderIdAndReceiverIdAndReadAtIsNull(
                        contactId,
                        currentUserId
                ));

        if (latestMessage == null)
        {
            return summary;
        }

        return summary.setLastMessageContent(latestMessage.getContent())
                      .setLastMessageSenderId(latestMessage.getSenderId())
                      .setLastMessageAt(latestMessage.getTimestamp());
    }

    private void ensureConnected(Long userOne, Long userTwo)
    {
        boolean isConnected = connectionRepository.findByUserIdAndConnectionId(userOne, userTwo)
                                                  .or(() -> connectionRepository.findByUserIdAndConnectionId(userTwo,
                                                                                                             userOne))
                                                  .map(Connection::getStatus)
                                                  .filter(status -> status.equals("CONNECTED"))
                                                  .isPresent();

        if (!isConnected)
        {
            throw new RuntimeException("Cannot use chat: Users are not connected.");
        }
    }

    private ChatMessageResponse toResponse(ChatMessage message)
    {
        return new ChatMessageResponse()
                .setId(message.getId())
                .setSenderId(message.getSenderId())
                .setReceiverId(message.getReceiverId())
                .setContent(message.getContent())
                .setTimestamp(message.getTimestamp())
                .setReadAt(message.getReadAt());
    }
}
