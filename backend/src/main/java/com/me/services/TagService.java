package com.me.services;

import com.me.entities.Genre;
import com.me.entities.Interest;
import com.me.repositories.GenreRepository;
import com.me.repositories.InterestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService
{
    private final GenreRepository genreRepository;
    private final InterestRepository interestRepository;

    public List<Genre> getGenres()
    {
        return genreRepository.findAll();
    }

    public List<Interest> getInterests()
    {
        return interestRepository.findAll();
    }
}
