package com.me.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.me.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>
{
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "((m.senderId = :userOne AND m.receiverId = :userTwo) OR " +
           "(m.senderId = :userTwo AND m.receiverId = :userOne)) " +
           "ORDER BY m.timestamp DESC, m.id DESC")
    Page<ChatMessage> findChatHistory(@Param("userOne") Long userOne,
                                      @Param("userTwo") Long userTwo,
                                      Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "((m.senderId = :userOne AND m.receiverId = :userTwo) OR " +
           "(m.senderId = :userTwo AND m.receiverId = :userOne)) " +
           "ORDER BY m.timestamp DESC, m.id DESC")
    List<ChatMessage> findLatestMessage(@Param("userOne") Long userOne,
                                        @Param("userTwo") Long userTwo,
                                        Pageable pageable);

    long countBySenderIdAndReceiverIdAndReadAtIsNull(Long senderId, Long receiverId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.readAt = :readAt " +
           "WHERE m.senderId = :contactId AND m.receiverId = :currentUserId AND m.readAt IS NULL")
    int markMessagesRead(@Param("currentUserId") Long currentUserId,
                         @Param("contactId") Long contactId,
                         @Param("readAt") LocalDateTime readAt);
}
