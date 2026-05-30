package com.me.controllers;

import com.me.entities.Genre;
import com.me.entities.Intention;
import com.me.entities.Interest;
import com.me.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController
{
    private final TagService tagService;

    @GetMapping("/genres")
    public List<Genre> getGenres()
    {
        return tagService.getGenres();
    }

    @GetMapping("/interests")
    public List<Interest> getInterests()
    {
        return tagService.getInterests();
    }

    @GetMapping("/intentions")
    public List<Intention> getIntentions()
    {
        return tagService.getIntetions();
    }
}
