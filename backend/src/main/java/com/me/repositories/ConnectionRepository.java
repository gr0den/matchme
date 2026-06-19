package com.me.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.me.entities.Connection;

import io.lettuce.core.dynamic.annotation.Param;;

public interface ConnectionRepository extends JpaRepository<Connection, Long>
{
    Optional<Connection> findByUserIdAndConnectionId(Long userId, Long connectionId);

    Boolean existsByUserIdAndConnectionId(Long userId, Long connectionId);

    @Query("SELECT c.userId FROM Connection c WHERE c.connectionId = :userId AND c.status = 'PENDING'")
    List<Long> findPendingIncomingRequests(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN c.userId = :userId THEN c.connectionId ELSE c.userId END " +
           "FROM Connection c WHERE (c.userId = :userId OR c.connectionId = :userId) AND c.status = 'CONNECTED'")
    List<Long> findActiveConnections(@Param("userId") Long userId);
}
