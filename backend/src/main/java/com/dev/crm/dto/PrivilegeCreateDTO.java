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
public class PrivilegeCreateDTO {

    @NotBlank(message = "{validation.privilege.name.required}")
    @Size(min = 3, max = 100, message = "{validation.privilege.name.size}")
    @Pattern(regexp = "^[A-Z_]+$", message = "{validation.privilege.name.pattern}")
    private String name;

    @Size(max = 255, message = "{validation.privilege.description.size}")
    private String description;

    @Size(max = 50, message = "{validation.privilege.category.size}")
    private String category;
}
