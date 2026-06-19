package com.me.dto.requests.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class ChatMessageRequest 
{
    @NotBlank(message = "Message content cannot be empty")
    private String content;
}
