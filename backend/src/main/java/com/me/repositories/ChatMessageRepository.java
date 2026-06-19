package com.me.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.me.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>
{
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :userOne AND m.recipientId = :userTwo) OR " +
           "(m.senderId = :userTwo AND m.recipientId = :userOne) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("userOne") Long userOne, @Param("userTwo") Long userTwo);
}
