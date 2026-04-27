package com.me.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
public class UserProfile
{
	@Id
	@Column(name = "user_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "user_id")
	private User user;

	private String name;

	private String nickName;

	private String bio;

	@Column(name = "avatar_url")
	private String avatarUrl;

	private String city;

	private Double latitude;

	private Double longitude;

	private boolean isOnboarded;

	@ManyToMany
	@JoinTable
	(
	name = "user_interests",
	joinColumns = @JoinColumn(name = "user_id"),
	inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	private Set<Tag> interests;

	@ManyToMany
	@JoinTable
	(
	name = "user_intents",
	joinColumns = @JoinColumn(name = "user_id"),
	inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	private Set<Tag> intents;
}
