package com.me.dto.response.chat;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class ChatSummaryResponse
{
    private Long contactId;
    private String contactName;
    private String contactPictureUrl;
    private String lastMessageContent;
    private Long lastMessageSenderId;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
}
