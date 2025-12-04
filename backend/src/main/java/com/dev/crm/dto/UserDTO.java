package com.dev.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Set<RoleDTO> roles = new HashSet<>();
    private boolean enabled;
    private String languagePreference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
