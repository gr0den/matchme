package com.me.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig
{
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   RedisLogoutHandler redisLogoutHandler) throws Exception
    {
        // Disable special csrf check and allow specific auth requests to be passed to backend without token.
        // Other requests will require token.
        http.csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers
                            (
                                    "/api/auth/register",
                                    "/api/auth/login",
                                    "/api/tags/**",
                                    "/api/data/users/**",
                                    "/error"
                            )
                    .permitAll()
                    .anyRequest()
                    .authenticated())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .logout(logout -> logout
                    .logoutUrl("/api/auth/logout")
                    .addLogoutHandler(redisLogoutHandler)
                    .deleteCookies("jwtCookie")
                    .clearAuthentication(true)
                    .logoutSuccessHandler((request, response, authentication) ->
                                          {
                                              response.setStatus(HttpServletResponse.SC_OK);
                                              response.setContentType("application/json");
                                              response.getWriter()
                                                      .write("{\"message\": \"User is successfully logged out\"}");
                                              response.getWriter().flush();
                                          }));

        return http.build();
    }
}
