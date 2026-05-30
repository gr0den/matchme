package com.me.services;

import com.me.entities.Genre;
import com.me.entities.Intention;
import com.me.entities.Interest;
import com.me.repositories.GenreRepository;
import com.me.repositories.IntentionRepository;
import com.me.repositories.InterestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TagService
{
    private final GenreRepository genreRepository;
    private final InterestRepository interestRepository;
    private final IntentionRepository intentionRepository;

    public List<Genre> getGenres()
    {
        return genreRepository.findAll();
    }

    public List<Interest> getInterests()
    {
        return interestRepository.findAll();
    }

    public List<Intention> getIntetions()
    {
        return intentionRepository.findAll();
    }
}
