package com.me.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.me.entities.Connection;

public interface ConnectionRepository extends JpaRepository<Connection, Long>
{
    
}
