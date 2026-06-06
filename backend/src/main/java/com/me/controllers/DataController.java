package com.me.controllers;

import com.me.dto.response.data.GenerateResponse;
import com.me.services.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DataController
{
    private final DataService dataService;

    @PostMapping("/api/data/users/generate/{amount}")
    public ResponseEntity<GenerateResponse> generate(@PathVariable Integer amount)
    {
        GenerateResponse response = dataService.generate(amount);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(response);
    }
}
