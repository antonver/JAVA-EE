package Ex.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Разрешить доступ к Swagger UI и документации API
                        .requestMatchers("/api/docs/**", "/api/docs").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/v3/api-docs.yaml").permitAll()
                        .requestMatchers("/swagger-resources/**", "/webjars/**").permitAll()
                        // Разрешить доступ к аутентификации
                        .requestMatchers("/auth/**").permitAll()
                        // Разрешить публичный GET для batiments (карта), но CRUD только для GESTIONNAIRE
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/batiments/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/batiments/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/batiments/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/batiments/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/batiments/**").hasRole("GESTIONNAIRE")
                        // Разрешить публичный GET для salles (autocomplete), но CRUD только для GESTIONNAIRE
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/salles/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/salles/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/salles/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/salles/**").hasRole("GESTIONNAIRE")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/salles/**").hasRole("GESTIONNAIRE")
                        // Разрешить доступ к API расстояния
                        .requestMatchers("/distance/**").permitAll()
                        // Доступ к админским эндпоинтам (GESTIONNAIRE)
                        .requestMatchers("/users/**").hasRole("GESTIONNAIRE")
                        .requestMatchers("/campus/**").hasRole("GESTIONNAIRE")
                        .requestMatchers("/composantes/**").hasRole("GESTIONNAIRE")
                        .requestMatchers("/universites/**").hasRole("GESTIONNAIRE")
                        .requestMatchers("/reservations/**").hasAnyRole("GESTIONNAIRE", "ENSEIGNANT")

                        // Admin endpoints (custom controllers)
                        .requestMatchers("/admin/**").hasRole("GESTIONNAIRE")
                        .requestMatchers("/management/**").hasRole("GESTIONNAIRE")

                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Разрешаем запросы с фронтенда
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));
        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        configuration.setExposedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Total-Count"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}