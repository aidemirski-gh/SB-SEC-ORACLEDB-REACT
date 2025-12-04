package com.dev.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleCreateDTO {
    @NotBlank(message = "{validation.role.name.required}")
    @Size(min = 5, max = 50, message = "{validation.role.name.size}")
    @Pattern(regexp = "^ROLE_[A-Z_]+$", message = "{validation.role.name.pattern}")
    private String name;

    @Size(max = 255, message = "{validation.role.description.size}")
    private String description;
}
