package Ex.control;

import Ex.dto.UpdateProfileRequestDto;
import Ex.dto.UserProfileResponseDto;
import Ex.modele.User;
import Ex.domain.UserRepository;
import Ex.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Контроллер для управления профилем пользователя
 */
@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * Получить информацию о текущем пользователе
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponseDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        UserProfileResponseDto response = new UserProfileResponseDto(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Обновить профиль текущего пользователя
     * Пользователь может обновлять только свой профиль
     */
    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCurrentUser(@Valid @RequestBody UpdateProfileRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        // Обновляем только fullName
        user.setFullName(request.fullName());
        userRepository.save(user);
        
        // Генерируем новый JWT токен с обновленными данными
        String newToken = jwtService.generateToken(user);
        
        // Возвращаем новый токен и обновленную информацию
        return ResponseEntity.ok(new UpdateProfileResponseDto(
            newToken,
            new UserProfileResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
            )
        ));
    }
    
    /**
     * DTO для ответа после обновления профиля
     * Включает новый JWT токен с обновленными данными
     */
    public record UpdateProfileResponseDto(
        String token,
        UserProfileResponseDto user
    ) {}
}
