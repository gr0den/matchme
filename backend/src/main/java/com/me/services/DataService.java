package com.me.services;

import com.me.dto.response.data.GenerateResponse;
import com.me.entities.Genre;
import com.me.entities.Interest;
import com.me.entities.Profile;
import com.me.entities.User;
import com.me.repositories.GenreRepository;
import com.me.repositories.InterestRepository;
import com.me.repositories.ProfileRepository;
import com.me.repositories.UserRepository;
import com.me.utils.Randomizer;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataService
{
    private final PasswordEncoder passwordEncoder;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final GenreRepository genreRepository;
    private final InterestRepository interestRepository;
    private final Faker faker = new Faker();

    @Transactional
    public GenerateResponse generate(Integer amount)
    {
        List<Profile> profiles = new ArrayList<>();
        List<User> users = new ArrayList<>();

        User user;
        Profile profile;
        Double longitude;
        double latitude;
        Point coords;

        List<Interest> interests = interestRepository.findAll();
        List<Genre> genres = genreRepository.findAll();


        for (int i = 0; i < amount; i++)
        {
            user = new User().setEmail(i + faker.internet()
                                                .emailAddress())
                             .setPassword(passwordEncoder.encode(faker.credentials()
                                                                      .password()));
            users.add(user);

            longitude = Double.parseDouble(faker.address()
                                                .longitude());
            latitude = Double.parseDouble(faker.address()
                                               .latitude());

            List<Interest> userInterests = new ArrayList<>(interests);
            List<Genre> userGenres = new ArrayList<>(genres);
            List<Genre> targetGenres = new ArrayList<>(genres);

            Collections.shuffle(userInterests);
            Collections.shuffle(userGenres);
            Collections.shuffle(targetGenres);

            userInterests = userInterests.subList(Randomizer.generateZeroToFive(), userInterests.size());
            userGenres = userGenres.subList(0, Randomizer.generateOneToNine());
            targetGenres = targetGenres.subList(0, Randomizer.generateOneToNine());

            coords = geometryFactory.createPoint(new Coordinate(longitude, latitude));

            profile = new Profile().setUsername(faker.credentials()
                                                     .username() + i)
                                   .setUser(user)
                                   .setBiography(faker.text()
                                                      .text(500))
                                   .setLocation(coords)
                                   .setMyGenres(new HashSet<>(userGenres))
                                   .setTargetGenres(new HashSet<>(targetGenres))
                                   .setInterests(new HashSet<>(userInterests))
                                   .setPictureUrl(faker.avatar()
                                                       .image())
                                   .setSearchRadius(faker.number()
                                                         .numberBetween(1000, 20000000));

            profiles.add(profile);
        }

        userRepository.saveAll(users);
        profileRepository.saveAll(profiles);

        return new GenerateResponse().setProfiles(profiles);
    }
}
