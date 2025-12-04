package com.dev.crm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleUpdateDTO {
    @NotNull(message = "{validation.user.roleId.required}")
    private Long roleId;
}
