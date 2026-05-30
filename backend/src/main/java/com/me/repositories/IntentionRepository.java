package com.me.repositories;

import com.me.entities.Intention;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntentionRepository extends JpaRepository<Intention, Long>
{

}
