package com.me.dto.response.connection;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class NotificationResponse 
{
    String type;
    String message;  
    Long requesterId;  
}
