package com.dev.crm.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateDTO {
    @Size(max = 255, message = "{validation.role.description.size}")
    private String description;
}
