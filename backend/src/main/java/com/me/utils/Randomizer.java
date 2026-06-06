package com.me.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Randomizer
{
    public static Long generateOneToTen()
    {
        return ThreadLocalRandom.current().nextLong(1, 11);
    }

    public static Long generateFiveToTen()
    {
        return ThreadLocalRandom.current().nextLong(5, 11);
    }

    public static List<Long> generateIdList(long size)
    {
        List<Long> ids = new ArrayList<>();

        for (int i = 0; i < size; i++)
        {
            ids.add(generateOneToTen());
        }

        return ids;
    }
}
