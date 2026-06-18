package com.me.dto.requests.connection;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class ConnectionRequest 
{
    @NotNull(message = "Requester id is mandatory")
    private Long requesterId;
    
    @NotNull(message = "Target user id is mandatory")
    private Long targetUserId;
}
