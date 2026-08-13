package vn.edu.crs.courseservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.edu.crs.courseservice.security.JwtAuthFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // API nội bộ: registration-service gọi trực tiếp
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // GET courses: public
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses",
                                "/courses/**"
                        )
                        .permitAll()

                        // POST courses: chỉ ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // PUT courses: chỉ ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE courses: chỉ ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Các endpoint khác phải đăng nhập
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}