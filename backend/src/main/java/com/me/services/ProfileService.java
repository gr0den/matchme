package com.me.services;

import com.me.dto.requests.profile.CreateProfileRequest;
import com.me.dto.requests.profile.UpdateProfileRequest;
import com.me.dto.response.profile.CreateProfileResponse;
import com.me.dto.response.profile.UpdateProfileResponse;
import com.me.entities.Genre;
import com.me.entities.Interest;
import com.me.entities.Profile;
import com.me.entities.User;
import com.me.exceptions.ProfileNotFoundException;
import com.me.exceptions.UserNotFoundException;
import com.me.mappers.ProfileMapper;
import com.me.repositories.GenreRepository;
import com.me.repositories.InterestRepository;
import com.me.repositories.ProfileRepository;
import com.me.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProfileService
{
    private static final String MESSAGE = "TEST";

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final InterestRepository interestRepository;
    private final GenreRepository genreRepository;

    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional
    public CreateProfileResponse createProfile(CreateProfileRequest request, Long userId)
    {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new UserNotFoundException());

        Set<Interest> userInterests = new HashSet<>(interestRepository.findAllById(request.getInterests()));
        Set<Genre> userGenres = new HashSet<>(genreRepository.findAllById(request.getGenres()));
        Set<Genre> userTargetGenres = new HashSet<>(genreRepository.findAllById(request.getTargetGenres()));

        Point coords = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));

        Profile userProfile = new Profile();

        userProfile.setUser(user)
                   .setInterests(userInterests)
                   .setMyGenres(userGenres)
                   .setTargetGenres(userTargetGenres)
                   .setUsername(request.getUserName())
                   .setBiography(request.getBio())
                   .setPictureUrl(request.getPictureUrl())
                   .setLocation(coords)
                   .setSearchRadius(request.getSearchRadius());

        userProfile = profileRepository.save(userProfile);

        return ProfileMapper.toCreateProfileResponse(userProfile);
    }

    @Transactional
    public UpdateProfileResponse updateProfile(UpdateProfileRequest request, Long userId)
    {
        Profile profile = profileRepository.findById(userId)
                                           .orElseThrow(() -> new ProfileNotFoundException());

        if (request.getUserName() != null)
        {
            profile.setUsername(request.getUserName());
        }

        if (request.getBio() != null)
        {
            profile.setBiography(request.getBio());
        }

        if (request.getInterests() != null)
        {
            Set<Interest> userInterests = new HashSet<>(interestRepository.findAllById(request.getInterests()));
            profile.setInterests(userInterests);
        }

        if (request.getGenres() != null)
        {
            Set<Genre> userGenres = new HashSet<>(genreRepository.findAllById(request.getGenres()));
            profile.setMyGenres(userGenres);
        }

        if (request.getTargetGenres() != null)
        {
            Set<Genre> userTargetGenres = new HashSet<>(genreRepository.findAllById(request.getTargetGenres()));
            profile.setTargetGenres(userTargetGenres);
        }

        if (request.getLatitude() != null && request.getLongitude() != null)
        {
            Point coords = geometryFactory.createPoint(new Coordinate(request.getLongitude(), request.getLatitude()));
            profile.setLocation(coords);
        }

        if (request.getPictureUrl() != null)
        {
            profile.setPictureUrl(request.getPictureUrl());
        }

        if (request.getSearchRadius() != null)
        {
            profile.setSearchRadius(request.getSearchRadius());
        }

        profile = profileRepository.save(profile);

        return ProfileMapper.toUpdateProfileResponse(profile);
    }
}
