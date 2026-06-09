package com.me.repositories;

import com.me.entities.Profile;
import com.me.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long>
{
    Long user(User user);
}
