package com.me.dto.response.data;

import com.me.entities.Profile;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
public class GenerateResponse
{
    List<Profile> profiles;
}
