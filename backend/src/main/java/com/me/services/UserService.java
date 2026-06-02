package com.me.services;

import com.me.dto.request.profile.UserProfileRequestDto;
import com.me.dto.response.profile.UserProfileResponseDto;
import com.me.entities.Genre;
import com.me.entities.Interest;
import com.me.entities.Profile;
import com.me.entities.User;
import com.me.exceptions.UserNotFoundException;
import com.me.mappers.UserProfileMapper;
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
public class UserService
{
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final InterestRepository interestRepository;
    private final GenreRepository genreRepository;

    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional
    public UserProfileResponseDto createProfile(UserProfileRequestDto request, Long userId)
    {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new UserNotFoundException("User is not found"));

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
                   .setLocation(coords);

        userProfile = profileRepository.save(userProfile);

        return UserProfileMapper.toUserProfileResponseDto(userProfile);
    }
}
