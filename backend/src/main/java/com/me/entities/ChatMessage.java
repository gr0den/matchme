package com.me.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@Accessors(chain = true)
public class ChatMessage 
{
    @Id
    @Generated(value = "org.hibernate.id.UUIDGenerator")
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
