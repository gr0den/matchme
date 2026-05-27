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

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(columnDefinition = "geography(Point, 4326)")
    private Point location;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable
            (
                    name = "profile_interests",
                    joinColumns = @JoinColumn(name = "profile_id"),
                    inverseJoinColumns = @JoinColumn(name = "interest_id")
            )
    private Set<Interest> interests = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable
            (
                    name = "profile_own_subgenres",
                    joinColumns = @JoinColumn(name = "profile_id"),
                    inverseJoinColumns = @JoinColumn(name = "subgenre_id")
            )
    private Set<Subgenre> ownSubgenres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable
            (
                    name = "profile_target_subgenres",
                    joinColumns = @JoinColumn(name = "profile_id"),
                    inverseJoinColumns = @JoinColumn(name = "subgenre_id")
            )
    private Set<Subgenre> targetSubgenres = new HashSet<>();
}
