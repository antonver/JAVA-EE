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


@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

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

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCurrentUser(@Valid @RequestBody UpdateProfileRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        user.setFullName(request.fullName());
        userRepository.save(user);

        String newToken = jwtService.generateToken(user);
        
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
    

    public record UpdateProfileResponseDto(
        String token,
        UserProfileResponseDto user
    ) {}
}
