package com.me.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.geolatte.geom.Point;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "profiles")
@Getter
@Setter
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String username;

    private String bio;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(columnDefinition = "geography(Point, 4326)")
    private Point location;

    @ManyToMany
    @JoinTable
            (
                    name = "profile_interest",
                    joinColumns = @JoinColumn(name = "profile_id"),
                    inverseJoinColumns = @JoinColumn(name = "interest_id")
            )
    private Set<Interest> interests;

    @ManyToMany
    @JoinTable
            (
                    name = "profile_genre",
                    joinColumns = @JoinColumn(name = "profile_id"),
                    inverseJoinColumns = @JoinColumn(name = "genre_id")
            )
    private Set<Genre> genres;
}
