package com.me.utils;

import java.util.concurrent.ThreadLocalRandom;

public class Randomizer
{
    public static int generateOneToNine()
    {
        return ThreadLocalRandom.current().nextInt(1, 10);
    }


    public static int generateZeroToFive()
    {
        return ThreadLocalRandom.current().nextInt(0, 6);
    }
}
