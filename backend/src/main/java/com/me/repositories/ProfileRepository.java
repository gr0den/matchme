package com.me.repositories;

import com.me.entities.Profile;
import com.me.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long>
{
    @Query(value = """
                  SELECT p.user_id
                  FROM user_profiles p
                  WHERE ST_DWithin(p.location,
                              ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                                           LEAST(p.search_radius * 1000, :searchRadius * 1000)) 
                  AND p.user_id != :currentUserId
            """,
            nativeQuery = true)
    List<Long> findRecommendationsByLocation(@Param("longitude") double longitude,
                                             @Param("latitude") double latitude,
                                             @Param("searchRadius") Integer searchRadius,
                                             @Param("currentUserId") Long currentUserId);

    Long user(User user);

    boolean existsById(Long id);

}

