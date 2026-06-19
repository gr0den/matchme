package com.me.dto.response.chat;

import java.util.List;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class ChatHistoryResponse
{
    private List<ChatMessageResponse> messages;
    private int page;
    private int size;
    private boolean hasMore;
}
