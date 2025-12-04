package com.dev.crm.controller;

import com.dev.crm.dto.UserDTO;
import com.dev.crm.dto.UserPreferencesUpdateDTO;
import com.dev.crm.dto.UserRoleUpdateDTO;
import com.dev.crm.entity.User;
import com.dev.crm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateDTO roleUpdateDTO,
            @AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.ok(
            userService.updateUserRole(id, roleUpdateDTO.getRoleId(), currentUser.getUsername())
        );
    }

    @PatchMapping("/{id}/preferences")
    public ResponseEntity<Void> updateUserPreferences(
            @PathVariable Long id,
            @Valid @RequestBody UserPreferencesUpdateDTO preferencesDTO,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Authorization check: user can only update own preferences, or admin can update any
        User user = ((User) currentUser);
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!user.getId().equals(id) && !isAdmin) {
            throw new AccessDeniedException("You can only update your own preferences");
        }

        userService.updateLanguagePreference(id, preferencesDTO);
        return ResponseEntity.ok().build();
    }
}
