package com.me.dto.response.connection;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class UserConnectionsResponse 
{
    private List<Long> pendingConnections;
    private List<Long> activeConnections;
}
