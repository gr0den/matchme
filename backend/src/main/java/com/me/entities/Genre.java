package com.me.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "genres")
@Getter
@Setter
public class Genre
{

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

    @Column(nullable = false, unique = true)
    private String name;


}
