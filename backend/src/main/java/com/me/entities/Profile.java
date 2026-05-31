package com.me.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
public class Profile
{
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String username;

    private String biography;

    private String pictureUrl;

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

}
