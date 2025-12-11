package Ex.control;

import Ex.Role;
import Ex.domain.UserRepository;
import Ex.dto.UserRoleUpdateDto;
import Ex.modele.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class UserManagementController {

    private final UserRepository userRepository;

    public UserManagementController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody UserRoleUpdateDto request) {
        if (request.role() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role is required"));
        }

        try {
            Role newRole = Role.valueOf(request.role().toUpperCase());
            
            return userRepository.findById(id)
                .map(user -> {
                    user.setRole(newRole);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of(
                        "message", "Role updated successfully",
                        "user", user.getEmail(),
                        "newRole", newRole.name()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
                
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid role: " + request.role(),
                "validRoles", List.of(Role.values())
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        return userRepository.findById(id)
            .map(user -> {
                userRepository.delete(user);
                return ResponseEntity.ok(Map.of("message", "User deleted"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
