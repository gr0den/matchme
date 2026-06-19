package com.me.dto.response.chat;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class ChatMessageResponse 
{
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
    private LocalDateTime readAt;
}
