package com.me.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.locationtech.jts.geom.Point;

import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@Accessors(chain = true)
public class Profile
{
    @Id
    @Setter(AccessLevel.NONE)
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String username;

    private String biography;

    private String pictureUrl;

    @JsonIgnore
    @Column(columnDefinition = "geography(Point, 4326)")
    private Point location;

    @ManyToMany
    @JoinTable
            (
                    name = "user_interests",
                    joinColumns = @JoinColumn(name = "user_id"),
                    inverseJoinColumns = @JoinColumn(name = "interest_id")
            )
    private Set<Interest> interests;


    @ManyToMany
    @JoinTable
            (
                    name = "user_genres",
                    joinColumns = @JoinColumn(name = "user_id"),
                    inverseJoinColumns = @JoinColumn(name = "genre_id")
            )
    private Set<Genre> myGenres;

    @ManyToMany
    @JoinTable
            (
                    name = "user_target_genres",
                    joinColumns = @JoinColumn(name = "user_id"),
                    inverseJoinColumns = @JoinColumn(name = "genre_id")
            )
    private Set<Genre> targetGenres;

    @Column(name = "search_radius")
    private Integer searchRadius;

}
