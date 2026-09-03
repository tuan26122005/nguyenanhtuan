package vn.edu.crs.registrationservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.edu.crs.registrationservice.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Cho phép STUDENT thực hiện POST để Đăng ký học phần
                        .requestMatchers(HttpMethod.POST, "/registrations", "/registrations/**")
                        .hasAnyRole("STUDENT", "ADMIN")

                        // Xem danh sách môn học đã đăng ký
                        .requestMatchers(HttpMethod.GET, "/registrations/my")
                        .hasAnyRole("STUDENT", "ADMIN")

                        // Hủy đăng ký môn học (nếu có)
                        .requestMatchers(HttpMethod.DELETE, "/registrations/**")
                        .hasAnyRole("STUDENT", "ADMIN")

                        // Các request khác bắt buộc xác thực
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