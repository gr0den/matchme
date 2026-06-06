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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DataService
{
    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final GenreRepository genreRepository;
    private final InterestRepository interestRepository;
    private final Faker faker = new Faker();

    @Transactional
    public GenerateResponse generate(Integer amount)
    {
        List<Profile> profiles = new ArrayList<>();
        User user;
        Profile profile;
        Double longitude;
        double latitude;
        Point coords;


        for (int i = 0; i < amount; i++)
        {
            user = new User().setEmail(faker.internet()
                                            .emailAddress())
                             .setPassword(faker.credentials()
                                               .password());
            user = userRepository.save(user);

            longitude = Double.parseDouble(faker.address()
                                                .longitude());
            latitude = Double.parseDouble(faker.address()
                                               .latitude());
            Set<Genre> userGenres = new HashSet<>(genreRepository.findAllById(Randomizer.generateIdList(Randomizer.generateOneToTen())));
            Set<Genre> targetGenres = new HashSet<>(genreRepository.findAllById(Randomizer.generateIdList(Randomizer.generateOneToTen())));
            Set<Interest> userInterests = new HashSet<>(interestRepository.findAllById(Randomizer.generateIdList(Randomizer.generateFiveToTen())));

            coords = geometryFactory.createPoint(new Coordinate(longitude, latitude));

            profile = new Profile().setUsername(faker.credentials()
                                                     .username())
                                   .setUser(user)
                                   .setBiography(faker.text()
                                                      .text(500))
                                   .setLocation(coords)
                                   .setMyGenres(userGenres)
                                   .setTargetGenres(targetGenres)
                                   .setInterests(userInterests)
                                   .setPictureUrl(faker.avatar()
                                                       .image());

            profileRepository.save(profile);
            profiles.add(profile);
        }

        return new GenerateResponse().setProfiles(profiles);
    }
}
